
console.log('this is port'+process.env.OPENSHIFT_MONGODB_DB_HOST);
module.exports = {
  myDB: {
  	name:"myDB",
    connector: 'loopback-connector-mongodb',
   /* host: 'mongodb://'+process.env.OPENSHIFT_MONGODB_DB_HOST,
    port: process.env.OPENSHIFT_MONGODB_DB_PORT,
    database: 'even3co',
    username: 'admin',
    password: 'ZWQbMQpvMz-F',*/
   // url:"mongodb://localhost:27017/FirstDB"
   // url:"mongodb://admin:ZWQbMQpvMz-F@127.11.22.2:27017/even3co"
  }
};
/*
var extend = require('util')._extend;

// Use the memory connector by default.
var DB = process.env.DB||'mongodb';
var host=process.env.OPENSHIFT_MONGODB_DB_HOST;
var port=process.env.OPENSHIFT_MONGODB_DB_PORT;
var DATASTORES = {
  mongodb: {
    host: host,
    database: 'even3co',
    username: 'admin',
    password: 'ZWQbMQpvMz-F',
    port: port
  }
};

if (!(DB in DATASTORES)) {
  console.error('Invalid DB "%s"', DB);
  console.error('Supported values', Object.keys(DATASTORES).join(' '));
  process.exit(1);
}

console.error('Using the %s connector.', DB);
console.error('To specify another connector:');
console.error('  `DB=oracle node .` or `DB=oracle slc run .`');
console.error('  `DB=mongodb node .` or `DB=mongodb slc run .`');
console.error('  `DB=mysql node .` or `DB=mysql slc run .`');

var connector = DB === 'memory' ? DB : 'loopback-connector-' + DB;
var config = extend({ connector: connector }, DATASTORES[DB]);

module.exports = {
  myDB: config
};*/