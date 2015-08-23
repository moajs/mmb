var get_collection_names = require('get_collection_names');


var host  = "127.0.0.1";
var port  = "27017";
var db    = "xbm-wechat-api";

//
get_collection_names(host, port, db, function(err, names){
  console.log(names);
})

