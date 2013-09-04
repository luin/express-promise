require('./spec_helper');
var expressPromise = require('..');

describe('json', function() {
  it('should work well without Promise', function(done) {
    var res = {
      json: function(body) {
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

});

