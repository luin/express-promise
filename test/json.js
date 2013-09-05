require('./spec_helper');
var expressPromise = require('..');

describe('json', function() {
  it('should work well without Promise', function(done) {
    var res = {
      json: function(body) {
        arguments.should.have.length(1);
        body.should.equal('hi');
        done();
      }
    };
    expressPromise({methods: ['json']})(null, res);

    res.json('hi');
  });

  it('should support Promise', function(done) {
    var res = {
      json: function(body) {
        arguments.should.have.length(1);
        body.promise.should.equal('hi');
        done();
      }
    };
    expressPromise({methods: ['json']})(null, res);

    function async(callback) {
      callback(null, 'hi');
    }

    res.json({
      promise: async.promise()
    });
  });

  it('should support two arguments', function(done) {
    var res = {
      json: function(status, body) {
        arguments.should.have.length(2);
        status.should.equal(200);
        body.promise.should.equal('hi');
        done();
      }
    };
    expressPromise({methods: ['json']})(null, res);

    function async(callback) {
      callback(null, 'hi');
    }

    res.json(200, {
      promise: async.promise()
    });
  });
});

