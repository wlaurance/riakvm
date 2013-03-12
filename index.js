var request = require('request'),
  fs = require('fs');

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
  } else {
    callback(null);
  }
};

exports.build = function(callback){

};
