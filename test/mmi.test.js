require('shelljs/global');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var should = require('should');
var moment = require('moment');
var Promise = require('bluebird');
var MongoClient = require('mongodb').MongoClient;

describe('mmi', function () {
  before(function () {
    which('mongoimport').should.containEql('mongoimport');
  });

  it('test mmi', function (done) {
    MongoClient.connect('mongodb://localhost:27017/mmb-test-db', function (err, db) {
      should(err).be.null();

      new Promise(function (resolve, reject) {
        db.collection('test').remove({
          'test': 'test'
        }, function (err, nRemoved) {
          should(err).be.null();
          resolve(nRemoved);
        })
      }).then(function (nRemoved) {
        exec('mmi', function (err, stdout) {
          should(err).be.null();
          stdout.should.containEql('exec sucess!');
          db.collection.findOne({}, function (err, result) {
            should(err).be.null();
            result.should.containEql({
              'test': 'test'
            });
          });
        });
      }).finally(function () {
        db.close();
        done();
      });
    })
  });
});
