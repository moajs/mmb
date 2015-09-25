#!/usr/bin/env node

/**
 * Module dependencies.
 */
require('shelljs/global');

var moment                = require('moment');
var tpl                   = require('tpl_apply');
var Promise               = require("bluebird");
var fs                    = Promise.promisifyAll(require("fs"));
var program               = require('commander');
var get_collection_names  = require('get_collection_names');
var child_process         = require('child_process');
var current_path          = process.cwd();

if (!which('mongoexport')) {
  echo('Sorry, this script requires mongoexport');
  exit(1);
}

var config_file = current_path + '/mongo.config.json';
var source = __dirname + '/tpl.js'
var dest = process.cwd() + '/export.sh'

program
  .version(require('./package.json').version)
  .option('-i, --init', 'init')
  .option('-a, --auth [info]', 'auth info like  username/password')
  .parse(process.argv);

console.log('moa mongodb-backup');

var user = {};
if (program.auth) {
  console.log(' optional: %j', program.auth);
  var arr = program.auth.split('/');
  console.log(arr)
  if (arr.length === 2) {
    user.name = arr[0]
    user.passwd = arr[1]
  }
}

if(program.init){
  console.log('init config...');  
  // Copy files to release dir
  cp('-f', __dirname +  '/mongo.config.json', current_path + '');
}else{  
  console.time("mmb");
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
        
        if (user.name) {
          config.auth = true;
          config.username = user.name;
          config.password = user.passwd;
        }
        
        get_collection_names(host, port, db, function(err, collection_names){
          console.log(collection_names);
          generate_shell(config, collection_names)
        })
    	}).catch(function(err){
    	  console.log(err);
    	});
  }
}

function generate_shell (config, collection_names) {
  if (config.auth === true) {
    source = __dirname + '/tpl_auth.js'
  }
  
  tpl.tpl_apply(source, {
    config            : config,
  	collection_names  : collection_names
  }, dest);

  var generated_dirname = moment().format(config.dirname);
  if(generated_dirname.split(' ').length > 0){
    generated_dirname = generated_dirname.split(' ').join('_');
  }
  
  setTimeout(function(){
    chmod('u+x', dest);

    // execFile: executes a file with the specified arguments
    child_process.execFile(dest, [generated_dirname], 
      {cwd:current_path}, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        }else{
          console.log('exec sucess!');
        }
        console.timeEnd("mmb");
    });
  }, 200);
}
