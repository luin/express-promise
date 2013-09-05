require('./spec_helper');
var expressPromise = require('..');

describe('render', function() {
  it('should work well with one param', function(done) {
    var res = {
      render: function(view) {
        arguments.should.have.length(1);
        view.should.equal('index');
        done();
      }
    };
    expressPromise({methods: ['render']})(null, res);

    res.render('index');
  });

  it('should work well with two params and callback', function(done) {
    var res = {
      render: function(view, callback) {
        arguments.should.have.length(2);
        view.should.equal('index');
        callback().should.equal('test');
        done();
      }
    };
    expressPromise({methods: ['render']})(null, res);

    res.render('index', function() {
      return 'test';
    });
  });

  it('should work well with two params and locals', function(done) {
    var res = {
      render: function(view, locals) {
        arguments.should.have.length(2);
        view.should.equal('index');
        locals.promise.should.equal('hi');
        done();
      }
    };
    expressPromise({methods: ['render']})(null, res);

    function async(callback) {
      callback(null, 'hi');
    }

    res.render('index', {
      promise: async.promise()
    });
  });

  it('should work well with three params', function(done) {
    var res = {
      render: function(view, locals, callback) {
        arguments.should.have.length(3);
        view.should.equal('index');
        locals.promise.should.equal('hi');
        callback().should.equal('test');
        done();
      }
    };
    expressPromise({methods: ['render']})(null, res);

    function async(callback) {
      callback(null, 'hi');
    }

    res.render('index', {
      promise: async.promise()
    }, function() {
      return 'test';
    });
  });
});


