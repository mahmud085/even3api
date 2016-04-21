var loopback = require('loopback');
var boot = require('loopback-boot');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var app = module.exports = loopback();


app.middleware('initial', bodyParser.urlencoded({ extended: true }));


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

app.get('/admin/newsletter',function(req,res){
     app.models.subscribers.find(function(err,result){
          if(err)console.log("Subscribers Not found !");
          else {
               app.models.Account.find({
                    where : {
                         "Newsletter" : true
                    }
               },function(err,user){
                    if(err)console.log("Users Not found !");
                    else {
                         res.render('newsLetter.ejs',{
                            subscribers : result,
                            users : user
                         });
                    }
               });
          }
     });
   
});
app.post('/admin/newsletter',function(req,res){
     console.log("Body = ",req.body);
     emailcontent = req.body.emailBody;
     selected = req.body.select;
     subject = req.body.subject;
     if(typeof selected !=='object'){
          app.models.Push.sendEmail(selected, subject, emailcontent);
     }else{
          for(i=0;i<selected.length;i++)
          app.models.Push.sendEmail(selected[i], subject, emailcontent);
     }
     res.redirect('/admin/newsletter');
});
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