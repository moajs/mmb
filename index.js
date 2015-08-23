#!/usr/bin/env node

/**
 * Module dependencies.
 */
require('shelljs/global');

var program = require('commander');

var current_path = process.cwd();


if (!which('mongoexport')) {
  echo('Sorry, this script requires mongoexport');
  exit(1);
}


if (!which('git')) {
  echo('Sorry, this script requires git');
  exit(1);
}


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
}

console.log('  - %s cheese', program.cheese);