var assert = require('assert'),
  lib = require('./index'),
  fs = require('fs'),
  rimraf = require('rimraf');

describe('lib', function(){
  it('should throw errors', function(done){
    lib.download({}, function(err){
      assert.equal(err.toString(), 'Error: Missing url destination');
      done();
    });
  });
  it('should throw errors', function(done){
    lib.download({url:'www.google.com'}, function(err){
      assert.equal(err.toString(), 'Error: Missing file name');
      done();
    });
  });
  it('should download the specified file', function(done){
    lib.download({
      url:'https://github.com/basho/riak/archive/riak-1.3.0.tar.gz',
      fileName:'riak-1.3.0.tar.gz'
    }, function(err){
      assert.equal(err, null);
      fs.exists('riak-1.3.0.tar.gz', function(exists){
        assert.ok(exists);
        done();
      });
    });
  });
  it('should throw errors', function(done){
    lib.extract({}, function(err){
      assert.equal(err.toString(), 'Error: Missing file name');
      done();
    });
  });
  it('should throw errors', function(done){
    lib.extract({fileName:'blah'}, function(err){
      assert.equal(err.toString(), 'Error: Missing destination');
      done();
    });
  });
  it('should extract the specified file', function(done){
    lib.extract({
      fileName:'riak-1.3.0.tar.gz',
      dest:'./'
    }, function(err){
      assert.equal(err, null);
      fs.exists('riak-riak-1.3.0', function(exists){
        assert.ok(exists);
        done();
      });
    });
  });
  after(function(done){
    rimraf('./riak-riak-1.3.0', function(error){
      fs.unlink('./riak-1.3.0.tar.gz', function(){
        fs.exists('./riak-riak-1.3.0', function(exists){
          assert.equal(exists, false);
          fs.exists('riak-1.3.0.tar.gz', function(exists){
            assert.equal(exists, false);
            done();
          });
        });
      });
    });
  });
});
