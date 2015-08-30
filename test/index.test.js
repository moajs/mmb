require('shelljs/global');
var path = require('path');
var should = require('should');
var MongoClient = require('mongodb').MongoClient;

describe('moa mongo uitls', function () {
  before(function (done) {
    which('mongo').should.containEql('mongo');

    //test dir
    mkdir('test/mmb_test_dir');
    cp('test/mongo.config.json', 'test/mmb_test_dir/mongo.config.json');
    process.chdir(path.join(process.cwd(), './test/mmb_test_dir'));

    //prepare mongo data
    MongoClient.connect('mongodb://localhost:27017/mmb-test-db', function (err, db) {
      should(err).be.null();
      db.collection('test').insert({
        'test': 'test'
      }, function (err) {
        should(err).be.null();
        db.close();
        done();
      });
    });
  });

  require('./mmb.test');
  require('./mmi.test');

  after(function (done) {
    //clean test dir
    process.chdir(path.join(process.cwd(), '..'));
    rm('-rf', 'mmb_test_dir');

    //clean mongo data
    MongoClient.connect('mongodb://localhost:27017/mmb-test-db', function (err, db) {
      should(err).be.null();
      db.collection('test').drop(function (err) {
        should(err).be.null();
        db.close();
        done();
      });
    });
  })
});
