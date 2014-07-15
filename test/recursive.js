require('./spec_helper');
var expressPromise = require('..');

describe('recursive', function() {
  it('should resolve a promise that resolves with a promise', function(done) {
    var res = {
      json: function(body) {
        body.a.should.equal('hi');
        done();
      }
    };

    expressPromise({methods: ['json']})(null, res);
    function async(callback) {
      callback(null, 'hi');
    }
    function doubleAsync(callback) {
      callback(null, async.promise());
    }

    res.json({
      a: doubleAsync.promise()
    });

  });

});


