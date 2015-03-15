require('./spec_helper');
var expressPromise = require('..');

describe('send', function() {
  it('should support string body', function(done) {
    var res = {
      send: function(body) {
        arguments.should.have.length(1);
        body.should.equal('hi');
        done();
      }
    };
    expressPromise({methods: ['send']})(null, res);

    res.send('hi');
  });

  it('should support buffer body', function(done) {
    var res = {
      send: function(body) {
        arguments.should.have.length(1);
        body.toString().should.equal('hi');
        done();
      }
    };
    expressPromise({methods: ['send']})(null, res);

    res.send(new Buffer('hi'));
  });

  it('should support promise body', function(done) {
    var res = {
      send: function(body) {
        arguments.should.have.length(1);
        body.should.equal('hi');
        done();
      }
    };
    expressPromise({methods: ['send']})(null, res);

    function async(callback) {
      callback(null, 'hi');
    }

    res.send(async.promise());
  });

  it('should work well with two params with promise', function(done) {
    var pass = 0;
    var res = {
      status: function(status) {
        arguments.should.have.length(1);
        status.should.equal(200);
        if (++pass === 2) {
          done();
        }
      },
      send: function(body) {
        arguments.should.have.length(1);
        body.promise.should.equal('hi');
        if (++pass === 2) {
          done();
        }
      }
    };
    expressPromise({methods: ['send']})(null, res);

    function async(callback) {
      callback(null, 'hi');
    }

    res.send(200, {
      promise: async.promise()
    });
  });

});



