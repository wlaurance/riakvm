var request = require('request'),
  fs = require('fs'),
  tar = require('tar.gz'),
  cp = require('child_process');

exports.download = function(params, callback){
  if (!params.url){
    callback(new Error('Missing url destination'));
  } else if (!params.fileName){
    callback(new Error('Missing file name'));
  } else {
    var file = request(params.url);
    var stream = fs.createWriteStream(params.fileName);
    stream.on('error', function(error){
      callback(error);
    });
    file.pipe(stream);
    file.on('end', callback);
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

//Check for binary executables required for building riak instances
//This function will run when the library module is required
var which = require('which');
var required = ['git', 'make', 'erl', 'gcc', 'g++'];
var checker = function(ex){ try { which.sync(ex); } catch (e) { throw e; }};
required.forEach(checker);
