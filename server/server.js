
var loopback = require('loopback');
var boot = require('loopback-boot');
var fs = require('fs');
var path = require('path');
var app = module.exports = loopback();

/*var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});
*/

//var Application = require('./ticketPurchaseDetails');


//console.log(app);

//var facebook = require('./facebookfriends.js');
//console.log(facebook.getfriends());

//PushNotification key
//AIzaSyApKoyaRxr-59rV0fKvb-8YBW9a8-95YS8

function prepareForPush() 
{
  var Notification = app.models.notification;
  var Application = app.models.application;
  var PushModel = app.models.push;

  Application.register('even3appdeveloper',
    'even3app',
    {
      description: 'LoopBack Push Notification Demo Application',
      pushSettings: {
        apns: {
          //certData: readCredentialsFile('apns_cert_dev.pem'),
         // keyData: readCredentialsFile('apns_key_dev.pem'),
  
          pushOptions: {
          },
          feedbackOptions: {
            batchFeedback: true,
            interval: 300
          }
        },
        gcm: {
          serverApiKey: 'AIzaSyApKoyaRxr-59rV0fKvb-8YBW9a8-95YS8'
        }
      }
    },
    function(err, app) {
      //if (err) return cb(err);
     // return cb(null, app);
    }
  );
  
/*function readCredentialsFile(name) {
 return fs.readFileSync(
   path.resolve(__dirname, 'credentials', name),
   'UTF-8'
 );
}*/

};



app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
    prepareForPush();
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
