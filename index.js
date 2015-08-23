#!/usr/bin/env node

/**
 * Module dependencies.
 */
require('shelljs/global');

var Promise               = require("bluebird");
var fs                    = Promise.promisifyAll(require("fs"));
var program               = require('commander');
var get_collection_names  = require('get_collection_names');
var current_path          = process.cwd();

if (!which('mongoexport')) {
  echo('Sorry, this script requires mongoexport');
  exit(1);
}


if (!which('git')) {
  echo('Sorry, this script requires git');
  exit(1);
}

var config_file = current_path + '/mongo.config.json';

program
  .version('0.0.1')
  .option('-i, --init', 'init')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

console.log('moa mongodb-backup :');
// if (program.peppers) console.log('  - peppers');
// if (program.pineapple) console.log('  - pineapple');
// if (program.bbqSauce) console.log('  - bbq');

if(program.init){
  console.log('init config...');
  
  // Copy files to release dir
  cp('-f', __dirname +  '/mongo.config.json', current_path + '');
}else{  
  if(fs.existsSync(config_file) == true) {
    fs.readFileAsync(config_file, {
      encoding: 'utf-8'
    }).then(function(str){
    		var _new_json_string = JSON.parse(JSON.stringify(str));
    		var obj = JSON.parse(_new_json_string);
    		return Promise.resolve(obj);
    	}).then(function(config){
        var host  = config.host;
        var port  = config.port;
        var db    = config.db;
        
        get_collection_names(host, port, db, function(err, names){
          console.log(names);
        })
    	}).catch(function(err){
    	  console.log(err);
    	});
  }
}

console.log('  - %s cheese', program.cheese);