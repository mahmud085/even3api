
var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

/*var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});
*/


//var facebook = require('./facebookfriends.js');
//console.log(facebook.getfriends());



/*
// Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

var config = {};
try {
 config = require('./providers.json');
} catch(err) {
 console.error('Please configure your passport strategy in `providers.json`.');
 console.error('Copy `providers.json.template` to `providers.json` and replace the clientID/clientSecret values with your own.');
 process.exit(1);
}
// Initialize passport
passportConfigurator.init();

// Configure passport strategies for third party auth providers
for(var s in config) {
 var c = config[s];
 c.session = c.session !== false;
 passportConfigurator.configureProvider(s, c);
}



passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential
});

*/




app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
	
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
/*

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

// Set up the /favicon.ico
app.use(loopback.favicon());

// request pre-processing middleware
app.use(loopback.compress());

// -- Add your pre-processing middleware here --

// boot scripts mount components like REST API
// Run the boot process asynchronously
boot(app, __dirname, function(err) {

// -- Mount static files here--
// All static middleware should be registered at the end, as all requests
// passing the static middleware are hitting the file system
// Example:
//   var path = require('path');
//   app.use(loopback.static(path.resolve(__dirname, '../client')));

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
  app.use(loopback.urlNotFound());

// The ultimate error handler.
  app.use(loopback.errorHandler());

  app.start = function() {
    // start the web server
    return app.listen(function() {
      app.emit('started');
      console.log('Web server listening at: %s', app.get('url'));
    });
  };

// start the server if `$ node server.js`
  if (require.main === module) {
    app.start();
  }
});*/