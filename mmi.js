#!/usr/bin/env node

require('shelljs/global');

if (!which('mongoimport')) {
  echo('Sorry, this script requires mongoimport');
  exit(1);
}

/**
 * Module dependencies.
 */
var child_process = require('child_process');
var moment = require('moment');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var tpl = require('tpl_apply');

var current_path = process.cwd();
var config_file = current_path + '/mongo.config.json';
var source = __dirname + '/tpl_mmi.js';
var dest = process.cwd() + '/import.sh';

console.log('moa mongodb-import');

console.time("mmi");

if (fs.existsSync(config_file) === true) {
  var latestBackUp = process.argv[2] ? process.argv[2] : getLatestBackup(current_path);
  var _new_json_string = JSON.parse(JSON.stringify(fs.readFileSync(config_file, {
    encoding: 'utf-8'
  })))
  var config = JSON.parse(_new_json_string);

  generate_shell(config, latestBackUp);
} else {
  echo('Sorry, please run this script in a mmb directory');
  exit(1);
}

/**
 * Find the last modified directory's name in a mmb directory
 *
 * @param {String} the mmb directory
 * @return {String}
 */
function getLatestBackup(directory) {
  try {
    return fs.readdirSync(current_path)
      .map(function (fileName) {
        var stat = fs.statSync(current_path + '/' + fileName);
        if (stat.isDirectory()) {
          return {
            name: fileName,
            stat: stat
          }
        }
      })
      .filter(function (file) {
        return file !== undefined;
      }).reduce(function (preFile, curFile) {
        if (curFile.stat.mtime > preFile.stat.mtime) {
          return curFile;
        } else {
          return preFile;
        }
      }).name;
  } catch (err) {
    echo('Sorry, can not find any available directory');
    exit(1);
  }
}

function generate_shell(config, latestBackUp) {
  var collection_names = fs.readdirSync(current_path + '/' + latestBackUp)
    .map(function (fileName) {
      return fileName.split('.')[0];
    });

  console.log(collection_names);

  tpl.tpl_apply(source, {
    config: config,
    collection_names: collection_names
  }, dest);

  setTimeout(function () {
    chmod('u+x', dest);
    // execFile: executes a file with the specified arguments
    child_process.execFile(dest, [latestBackUp], {
      cwd: current_path
    }, function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      } else {
        console.log('exec sucess!');
      }
      
      console.timeEnd("mmi");
    });
  }, 200)
}
