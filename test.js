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
      url:'http://downloads.basho.com.s3-website-us-east-1.amazonaws.com/riak/1.3/1.3.0/riak-1.3.0.tar.gz',
      fileName:'riak-1.3.0.tar.gz',
      disco: true
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
      fs.exists('riak-1.3.0', function(exists){
        assert.ok(exists);
        lib.extract({
          fileName: 'riak-1.3.0.tar.gz',
          dest:'./'
        }, function(err){
          assert.equal('Error: output directory exists and could be written over', err);
          done();
        });
      });
    });
  });
  it('should make all', function(done){
    lib.build({
      dir:'riak-1.3.0',
      fake:true
    }, function(err){
      assert.equal(err, null);
      fs.exists('./riak-1.3.0/rel/riak/bin/riak', function(exists){
        assert.ok(exists);
        done();
      });
    });
  });
  it('should list available versions', function(done){
    lib.listVersions({url:'http://downloads.basho.com.s3-website-us-east-1.amazonaws.com/riak/'}, function(err, list){
      assert.equal(err, null);
      assert.equal(list.length > 0, true);
      done();
    });
  });
  after(function(done){
    rimraf('./riak-1.3.0', function(error){
      fs.unlink('./riak-1.3.0.tar.gz', function(){
        fs.exists('./riak-1.3.0', function(exists){
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

describe('bin', function() {
  var cp = require('child_process').spawn;
  it('should output --help with no options', function(done){
    function run(a, cb) {
      var data = "";
      cp('./riakvm', a)
      .stdout.on('data', function(d) {
        data += d.toString();
      })
      .on('close', function() {
        cb(null, data);
      });
    }
    run([], function(err, data1) {
      run(['--help'], function(err, data2) {
        assert.equal(data1, data2);
        done();
      });
    });
  });
});
