var request = require('request'),
  fs = require('fs'),
  tar = require('tar.gz');

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
    new tar().extract(params.fileName, params.dest, function(err){
      callback(err);
    });
  }
};

exports.build = function(callback){

};
