require('./spec_helper');
var expressPromise = require('..');

describe('basic', function() {
  it('should use the toJSON method', function(done) {
    var res = {
      json: function(body) {
        body.a.b.should.equal('hi');
        body.a.c.should.not.have.property('d');
        body.a.c.f.should.equal('hi');
        done();
      }
    };
    expressPromise({methods: ['json']})(null, res);

    function async(callback) {
      callback(null, 'hi');
    }

    res.json({
      a: {
        b: async.promise(),
        c: {
          d: async.promise(),
          toJSON: function() {
            return {
              f: 'hi'
            };
          }
        }
      }
    });
  });

});


