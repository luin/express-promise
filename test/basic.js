require('./spec_helper');
var expressPromise = require('..');

describe('basic', function() {
  it('should limit the max deep', function(done) {
    var res = {
      json: function(body) {
        body.a.b.should.equal('hi');
        body.a.c.d.toString().should.equal('[object Promise]');
        done();
      }
    };
    expressPromise({methods: ['json'], maxDeep: 2})(null, res);

    function async(callback) {
      callback(null, 'hi');
    }

    res.json({
      a: {
        b: async.promise(),
        c: {
          d: async.promise()
        }
      }
    });
  });

});


