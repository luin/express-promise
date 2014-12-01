var isPromise = function(v) {
  return v !== null && typeof v === 'object' && typeof v.then === 'function';
};

var isMongooseQuery = function(v) {
  return v !== null && typeof v === 'object' && typeof v.exec === 'function';
};

var resolveAsync = function(object, callback, count, options) {
  if (!object || typeof object !== 'object') {
    return callback(null, object);
  }

  if (count === 0) {
    return callback(new Error('Max promises (' + options.maxPromise + ') reached'));
  }

  if (isPromise(object)) {
    return object.then(function(result) {
      if (isPromise(result) || isMongooseQuery(result)) {
        resolveAsync(result, callback, count - 1, options);
      } else {
        callback(null, result);
      }
    }, function(err) {
      callback(err);
    });
  }

  if (isMongooseQuery(object)) {
    return object.exec(function(err, result) {
      if (err) {
        callback(err);
      }
      if (isPromise(result) || isMongooseQuery(result)) {
        resolveAsync(result, callback, count - 1, options);
      } else {
        callback(err, result);
      }
    });
  }

  if (options.skipTraverse && options.skipTraverse(object)) {
    return callback(null, object);
  }

  if (typeof object.toJSON === 'function') {
    object = object.toJSON();
    if (!object || typeof object !== 'object') {
      return callback(null, object);
    }
  }

  var remains = [];
  Object.keys(object).forEach(function(key) {
    if (isPromise(object[key]) || isMongooseQuery(object[key])) {
      object[key].key = key;
      remains.push(object[key]);
    } else if (typeof object[key] === 'object') {
      remains.push({
        key: key,
      });
    }
  });

  if (!remains.length) {
    return callback(null, object);
  }
  var pending = remains.length;

  remains.forEach(function(item) {
    function handleDone(err, result) {
      if (err) {
        return callback(err);
      }
      object[item.key] = result;
      if (--pending === 0) {
        callback(null, object);
      }
    }
    if (isPromise(item)) {
      item.then(function(result) {
        handleDone(null, result);
      }, function(err) {
        handleDone(err);
      });
    } else if (isMongooseQuery(item)) {
      item.exec(function(err, result) {
        handleDone(err, result);
      });
    } else {
      resolveAsync(object[item.key], handleDone, count - 1, options);
    }
  });
};

var expressPromise = function(options) {
  var defaultOptions = {
    methods: ['json', 'render', 'send'],
    maxPromise: 20
  };

  options = options || {};
  Object.keys(defaultOptions).forEach(function(key) {
    if (typeof options[key] === 'undefined') {
      options[key] = defaultOptions[key];
    }
  });

  return function(_, res, next) {
    if (typeof next !== 'function') {
      next = function() {};
    }
    if (~options.methods.indexOf('json')) {
      var originalResJson = res.json.bind(res);
      res.json = function() {
        var args = arguments;
        var body = args[0];
        var status;
        if (2 === args.length) {
          // res.json(body, status) backwards compat
          if ('number' === typeof args[1]) {
            status = args[1];
          } else {
            status = body;
            body = args[1];
          }
        }
        resolveAsync(body, function(err, result) {
          if (err) {
            return next(err);
          }
          if (typeof status !== 'undefined') {
            originalResJson(status, result);
          } else {
            originalResJson(result);
          }
        }, options.maxPromise, options);
      };
    }

    if (~options.methods.indexOf('render')) {
      var originalResRender = res.render.bind(res);
      res.render = function(view, obj, fn) {
        obj = obj || {};
        if (arguments.length === 1) {
          return originalResRender(view);
        }
        if (arguments.length === 2) {
          if (typeof obj === 'function') {
            return originalResRender(view, obj);
          }
          resolveAsync(obj, function(err, result) {
            if (err) {
              return next(err);
            }
            originalResRender(view, result);
          }, options.maxPromise, options);
          return;
        }
        resolveAsync(obj, function(err, result) {
          if (err) {
            return next(err);
          }
          originalResRender(view, result, fn);
        }, options.maxPromise, options);
      };
    }

    if (~options.methods.indexOf('send')) {
      var originalResSend = res.send.bind(res);
      res.send = function() {
        var args = arguments;
        var body = args[0];
        var status;
        if (2 === args.length) {
          // res.send(body, status) backwards compat
          if ('number' === typeof args[1]) {
            status = args[1];
          } else {
            status = body;
            body = args[1];
          }
        }
        if (typeof body === 'object' && !(body instanceof Buffer)) {
          resolveAsync(body, function(err, result) {
            if (err) {
              return next(err);
            }
            if (typeof status !== 'undefined') {
              originalResSend(status, result);
            } else {
              originalResSend(result);
            }
          }, options.maxPromise, options);
        } else {
          if (status) {
            originalResSend(status, body);
          } else {
            originalResSend(body);
          }
        }
      };
    }
    next();
  };
};

module.exports = expressPromise;
