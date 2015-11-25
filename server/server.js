var loopback = require('loopback');
var boot = require('loopback-boot');
var fs = require('fs');
var path = require('path');
var app = module.exports = loopback();


function register() {
  Application.register('even3appdeveloper',
    'even3app', {
      description: 'LoopBack Push Notification Demo Application',
      pushSettings: {
        apns: {
          //certData: readCredentialsFile('apns_cert_dev.pem'),
          // keyData: readCredentialsFile('apns_key_dev.pem'),

          pushOptions: {},
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
      console.log(app);
      //if (err) return cb(err);
      // return cb(null, app);
    }
  );
}



function prepareForPush() {

  var Notification = app.models.notification;
  var Application = app.models.application;
  var PushModel = app.models.push;

  Application.find(function(err, result) {
    if (err)
      return;
    if (result[0])
      return;
    else
      register();
  });

};



app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
    prepareForPush();
  });
};

boot(app, __dirname, function(err) {

  if (err) throw err;
  if (require.main === module)
    app.start();
});