var request = require('request'),
  fs = require('fs'),
  tar = require('tar.gz'),
  async = require('async'),
  _ = require('underscore'),
  cp = require('child_process');

exports.download = function(params, callback){
  if (!params.url){
    callback(new Error('Missing url destination'));
  } else if (!params.fileName){
    callback(new Error('Missing file name'));
  } else {
    var file = request(params.url);
    var stream = fs.createWriteStream(params.fileName);
    var charm = require('charm')();
    charm.pipe(process.stdout);
    charm.reset();
    charm.write('\n');
    file.on('response', function(r){
      var totalFileLength = parseInt(r.headers['content-length'], 10);
      var counter = 0;
      var prevStringLen = 0;
      charm.cursor(false);
      charm.right(1);
      file.on('data', function(d){
        counter += d.length;
        var prct = ((counter / totalFileLength) * 100).toFixed(2);
        var str = prct + '% downloaded';
        if (params.disco)
          charm.foreground(Math.floor((prct * .01) * 255));
        charm.write(str);
        charm.left(str.length);
      });
    });
    stream.on('error', function(error){
      callback(error);
    });
    file.pipe(stream);
    file.on('end', function(){
      charm.cursor(true);
      charm.end();
      callback();
    });
  }
};

exports.extract = function(params, callback){
  if (!params.fileName){
    callback(new Error('Missing file name'));
  } else if (!params.dest){
    callback(new Error('Missing destination'));
  } else {
    fs.exists(params.extractedDir || params.fileName.split('.tar.gz')[0], function(exists){
      if (exists){
        callback(new Error('output directory exists and could be written over'));
      } else {
        new tar().extract(params.fileName, params.dest, function(err){
          callback(err);
        });
      }
    });
  }
};

exports.build = function(params, callback){
  if (!params.dir){
    callback(new Error('Missing directory'));
  } else if(params.fake){
    var mkdirp = require('mkdirp');
    mkdirp(params.dir + '/rel/riak/bin/riak', callback);
  } else {
    var build = cp.spawn('make', ['rel'], {
      cwd:params.dir,
      env:process.env,
      stdio:'inherit'
    });
    build.on('exit', function(code){
      callback(code || null);
    });
  }
};

exports.listVersions = function(params, callback){
  var versionStripper = function(raw, cb){
    var list = [];
    raw.replace(/<a(.+)>(.+)<\/a>/g, function(a,b,c){
      list.push(c.trim());
    });
    cb(_.filter(list, function(n){ return n !== 'CURRENT' && n !== 'Parent Directory' }));
  }
  request(params.url, function(e,r,b){
    versionStripper(b, function(bases){
      var transformer = function(v, cb){
        request(params.url + v + '/', function(e,r,b){
          versionStripper(b, function(list){
            cb(null, {v:v, p:list});
          });
        });
      };
      async.map(bases, transformer, function(err, results){
        callback(err, results);
      });
    });
  });
};

//Check for binary executables required for building riak instances
//This function will run when the library module is required
var which = require('which');
var required = ['git', 'make', 'erl', 'gcc', 'g++'];
var checker = function(ex){ try { which.sync(ex); } catch (e) { throw e; }};
required.forEach(checker);
