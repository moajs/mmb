require('shelljs/global');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var should = require('should');
var moment = require('moment');

describe('mmb', function () {
  before(function () {
    which('mongoexport').should.containEql('mongoexport');
  });

  it('test mmb', function (done) {
    exec('mmb', function (err, stdout) {
      should(err).be.null();
      stdout.should.containEql('exec sucess!');
      var json = fs.readFileSync(process.cwd() + '/' + moment().format('YYYY-MM-DD') + '/test.json', {
        encoding: 'utf8'
      });
      json.should.containEql('"test":"test"');
      done();
    });
  })
});
