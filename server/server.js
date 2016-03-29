var loopback = require('loopback');
var boot = require('loopback-boot');
var fs = require('fs');
var path = require('path');
var app = module.exports = loopback();

var Notification = app.models.notification;
var Application = app.models.application;
var PushModel = app.models.push;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function register() {
  app.models.application.register('even3appdeveloper',
    'even3app', {
      description: 'LoopBack Push Notification Demo Application',
      pushSettings: {
        apns: {
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
    }
  );
}

function prepareForPush() {

  app.models.application.find(function(err, result) {
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