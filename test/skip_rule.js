require('./spec_helper');
var expressPromise = require('..');

describe('skip rule', function() {
  it('should skip traverse the object', function(done) {
    var res = {
      json: function(body) {
        body.a.b.should.equal('hi');
        body.a.c.name.should.equal('lib');
        done();
      }
    };
    expressPromise({methods: ['json'], skipTraverse: function(object) {
      return object.hasOwnProperty('name');
    }})(null, res);

    function async(callback) {
      callback(null, 'hi');
    }

    res.json({
      a: {
        b: async.promise(),
        c: {
          name: 'lib',
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
