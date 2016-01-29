var CONTAINERS_URL = '/containers/';
var loopback = require('loopback');
var app = module.exports = loopback();
var fs = require('fs');
var path = require('path');
var AccessToken = loopback.AccessToken;
var https = require('https');
var baseUrl = "http://even3app.com" ;
var config = require('../../server/config.json');

module.exports = function(Account) {

  Account.invitefriend = function(data, cb) {
    
    console.log('invite friends > data = ' + JSON.stringify(data.req.body));
    
    var eventName = "An Event";
    Account.app.models.Event.find({
        where: {
          'id': data.req.body.EventId
        }
    }, function (error, event) {
        if (!error)
            eventName = event.Name ;
    });
    
    console.log("event name = " + eventName);

    for (var i = 0; i < data.req.body.email.length; i++) {
      Account.find({
        where: {
          'email': data.req.body.email[i].address
        }
      }, function(err, result) {
        var user = result[0];
        if (user)
          Account.app.models.Participant.create({
            Invited: true,
            AccountId: user.id,
            EventId: data.req.body.EventId
          }, function(err) {

          });
          var message = user.FirstName + " invited you to join " + eventName ;
          Account.app.models.Push.sendNotification(user.id, message);
      });
    }
    
    for (var i = 0; i < data.req.body.phone.length; i++) {
      Account.find({
        where: {
          'phone': data.req.body.phone[i].number
        }
      }, function(err, result) {
        if (result[0])
          Account.app.models.Participant.create({
            Invited: true,
            AccountId: result[0].id,
            EventId: data.req.body.EventId
          }, function(err) {

          });
          
          var message = result[0].FirstName + " invited you to join " + eventName ;
          Account.app.models.Push.sendNotification(result[0].id, message);
      });
    }

    cb(null, {"result" : "success"});
  };


  Account.sendemail = function(data, cb) {
    if (!data.req.body.email)
      cb(true, 'You must specify an email');
    //console.log(data.req.body.email);

    Account.find({
      where: {
        "email": data.req.body.email
      }
    }, function(err, result) {
      if (err)
        cb(err);
      if (!result[0])
        cb(null, 'There is no user registered by the email');
      if (result[0]) {
        var mail = '';
        for (var i = 0; i < data.req.body.email.length; i++)
          mail = mail + String.fromCharCode(data.req.body.email.charCodeAt(i) + 2);
        var link = baseUrl + '/resetpassword/' + mail;
        //console.log(mail);

        loopback.Email.send({
            to: data.req.body.email,
            from: "even3co@gmail.com",
            subject: "Even3 Password Reset",
            text: "text message",
            html: '<p>Hi ' + result[0].FirstName + '</p><p> You have requested to reset the password. Please click the link bellow to set your new password. If it does not work, click the button.</p>' + '<p>' + link + '</p>' + '<p><button href="http://even3app.com/login.html">Reset Password</button></p>'
          },
          function(err, result) {
                if (err) {
                    console.log('Something went wrong while sending email.');
                    cb(err);
                }
            
                if (result.message == 'success') {
                    console.log(result.message);
                    cb(null, 'success');
                }
          });
      }

    });

  };
  // reset password

  Account.passwordreset = function(data, cb) {
    if (data.req.body.email == null) {
      var msg = {
        error: 404,
        message: 'Email is required'
      }
      cb(null, msg);
    }

    Account.find({
      where: {
        "email": data.req.body.email
      }
    }, function(err, ant) {
      if (err)
        cb(err);
      if (ant[0]) {
        ant[0].accessTokens.create({
          created: new Date(),
        }, function(err, newToken) {
          if (err)
            cb(err);
          if (ant) {
            console.log(newToken);
            cb(null, newToken);
          }
        });
      }
    });
  }



  //Social Signin

  Account.socialsignin = function(data, cb) {

    if (data.req.body.email == null) {
        cb(null, "Email Field is empty");   
    }

    Account.find({
      where: {
        "email": data.req.body.email
      }
    }, function(err, ant) {
      if (err)
        cb(null, err);
      if (ant[0] == undefined) {
        Account.create({
          FirstName: data.req.body.FirstName,
          email: data.req.body.email,
          password: data.req.body.Id,
          LastName: data.req.body.LastName,
          Newsletter: data.req.body.Newsletter,
          username: data.req.body.username,
          SavedBusiness: data.req.body.SavedBusiness,
          EmailNotification: data.req.body.EmailNotification,
          PushNotification: data.req.body.PushNotification

        }, function(err, ant) {
          if (err) {
            console.log(err);
            cb(null, err);
          }

          if (data.req.body.Type == 'FB') {
            ant.FacebookID = data.req.body.Id;
            ant.accessTokenFacebook = data.req.body.Token;
          } else {
            ant.GoogleID = data.req.body.Id;
            ant.accessTokenGoogle = data.req.body.Token;
          }
          ant.save();
          ant.accessTokens.create({
            created: new Date(),
          }, function(err, newToken) {
                if (err) {
                    console.log('Error in new token');
                    cb(null, err);
                } else {
                    ant.accessToken = newToken.id;
                    cb(null, ant);
                }
          });

        });

      } else {
        
        if (ant[0].FacebookID == null && data.req.body.Type == 'FB') {
            ant[0].FacebookID = data.req.body.Id;
            ant[0].accessTokenFacebook = data.req.body.Token;
            ant[0].save();
        }
        
        if (ant[0].GoogleID == null && data.req.body.Type == 'Google') {
            ant[0].GoogleID = data.req.body.Id;
            ant[0].accessTokenGoogle = data.req.body.Token;
            ant[0].save();
        }

        ant[0].accessTokens.create({
          created: new Date(),
        }, function(err, newToken) {
          if (err) {
            console.log('err in newToken');
            cb(null, err);
          } else {
            ant[0].accessToken = newToken.id;
            console.log(newToken);
            cb(null, ant[0]);
          }
        });
      }

    });
  };

  // Social Sign in afterRemote Method

  Account.afterRemote('socialsignin', function(context, remoteMethodOutput, next) {
    
    var kue = require('kue'),
        queue = kue.createQueue();
    
    var job ;
    if (context.req.body.Type == 'FB') {
      job = queue.create('FindFacebook', {
        accessToken: context.req.body.Token
      }).save(function(err) {
        if (!err) console.log('FB is it ' + job.id);
      });
    } else {
      job = queue.create('FindGoogle', {
        accessToken: context.req.body.Token
      }).save(function(err) {
        if (!err) console.log('Google  is it ' + job.id);
      });
    }

    job.on('complete', function(result) {
      console.log('completed job ' + job.id);
      next();
    });

    queue.process('FindGoogle', function(job, done) {
      if (!job.data.accessToken)
        done();

      var url = 'https://www.googleapis.com/plus/v1/people/me/people/visible?maxResults=99&access_token=' + job.data.accessToken;

      https.get(url, function(res) {
        var body = '';

        res.on('data', function(chunk) {
          body += chunk;
        });

        res.on('end', function() {

          body = JSON.parse(body);

          var friends = [];
          for (var i in body.items) {
            Account.find({
              where: {
                'GoogleID': body.items[i].id
              }
            }, function(err, ant) {
              if (ant[0]) {
                friends.push(ant[0].id);
              }
            });
          }
          Account.find({
            where: {
              'id': remoteMethodOutput.id
            }
          }, function(err, ant) {
            if (ant[0] && friends.length != 0) {
              console.log(friends[0]);
              ant[0].Friends = [];
              for (var i = 0; i < friends.length; i++)
                ant[0].Friends[i] = friends[i];
              ant[0].save();
            }
          });

          console.log(body.items);
        });
      }).on('error', function(e) {
        console.log("Got an error: ", e);
      });
      done(null);
    });

    // Friend Finding Process
    queue.process('FindFacebook', function(job, done) {
      console.log(job.data.accessToken);
      console.log('processing job ' + job.id);

      var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: '/me/friends' + '?access_token=' + job.data.accessToken, //apiPath example: '/me/friends'
        method: 'GET'
      };

      var buffer = ''; //this buffer will be populated with the chunks of the data received from facebook
      var request = https.get(options, function(result) {
        result.setEncoding('utf8');
        result.on('data', function(chunk) {
          buffer += chunk;
        });

        result.on('end', function() {
          //console.log(buffer);
          var user = JSON.parse(buffer);
          //console.log(buffer);
          var friends = [];
          for (var i in user.data) {
            console.log(user.data[i].id);
            Account.find({
              where: {
                'FacebookID': user.data[i].id
              }
            }, function(err, ant) {
              if (ant[0]) {
                friends.push(ant[0].id);
              }
            });
          }
          Account.find({
            where: {
              'id': remoteMethodOutput.id
            }
          }, function(err, ant) {
            //console.log(friends.length);
            //console.log(ant[0]&&friends.length!=0);
            if (ant[0] && friends.length != 0) {
              console.log(friends[0]);
              ant[0].Friends = [];
              for (var i = 0; i < friends.length; i++)
                ant[0].Friends[i] = friends[i];
              ant[0].save();
            }
          });

          //console.log(JSON.stringify(buffer));
          //callback();
        });
      });

      request.on('error', function(e) {
        console.log('error from facebook.getFbData: ' + e.message)
      });
      request.end();
      done(null);
    });

  });

  // Adding social Token
  Account.addtoken = function(data, cb) {

    Account.find({
      where: {
        "id": data.req.body.Id
      }
    }, function(err, ant) {
      if (err)
        cb(null, err);
      else {
        if (data.req.body.Type == 'FB')
          ant[0].accessTokenFacebook = data.req.body.Token;
        else
          ant[0].accessTokenGoogle = data.req.body.Token;

        ant[0].save();
        console.log(ant[0]);
        cb(null, 'Sucessfully Updated');
      }
    });
  };

  Account.addaccount = function(ctx, options, cb) {

    if (!options) options = {};
    ctx.req.params.container = 'profilepic';

    Account.app.models.container.upload(ctx.req, ctx.result, options, function(err, fileObj) {
      //console.log(fileObj);
      if (err) {
        cb(err);
      }
      if (fileObj.files.hasOwnProperty('file')) {
        var fileInfo = fileObj.files.file[0];
        if (fileObj.fields.hasOwnProperty('FirstName'))
          var FirstName = fileObj.fields.FirstName[0];
        if (fileObj.fields.hasOwnProperty('LastName'))
          var LastName = fileObj.fields.LastName[0];
        if (fileObj.fields.hasOwnProperty('username'))
          var username = fileObj.fields.username[0];
        if (fileObj.fields.hasOwnProperty('email'))
          var email = fileObj.fields.email[0];
        if (fileObj.fields.hasOwnProperty('password'))
          var password = fileObj.fields.password[0];
        if (fileObj.fields.hasOwnProperty('Newsletter'))
          var Newsletter = fileObj.fields.Newsletter[0];
        if (fileObj.fields.hasOwnProperty('FacebookID'))
          var FacebookID = fileObj.fields.FacebookID[0];
        if (fileObj.fields.hasOwnProperty('GoogleID'))
          var GoogleID = fileObj.fields.GoogleID[0];
        if (fileObj.fields.hasOwnProperty('SavedBusiness'))
          var SavedBusiness = fileObj.fields.SavedBusiness[0];
        if (fileObj.fields.hasOwnProperty('EmailNotification'))
          var EmailNotification = fileObj.fields.EmailNotification[0];
        if (fileObj.fields.hasOwnProperty('PushNotification'))
          var PushNotification = fileObj.fields.PushNotification[0];

        Account.create({
          FirstName: FirstName,
          email: email,
          password: password,
          username: username,
          UserPicture: CONTAINERS_URL + fileInfo.container + '/download/' + fileInfo.name,
          LastName: LastName,
          Newsletter: Newsletter,
          FacebookID: FacebookID,
          GoogleID: GoogleID,
          SavedBusiness: SavedBusiness,
          EmailNotification: EmailNotification,
          PushNotification: PushNotification

        }, function(err, ant) {
          if (err)
            cb(null, err);
          //console.log(fileInfo);
          var extensionType = fileInfo.type.split('/');
          console.log(extensionType);
          var fileCurrentPath = './server/storage/profilepic' + '/' + fileInfo.name;
          var newFilePath = './server/storage/profilepic' + '/' + ant.id + '.' + extensionType[1];

          fs.rename(fileCurrentPath, newFilePath, function(err) {
            if (err) throw err;
            //console.log('renamed complete');
          });

          ant.UserPicture = CONTAINERS_URL + fileInfo.container + '/download/' + ant.id + '.' + extensionType[1];
          ant.save();
          cb(null, ant);

        });
      } else {
        if (fileObj.fields.hasOwnProperty('username'))
          var username = fileObj.fields.username[0];
        if (fileObj.fields.hasOwnProperty('FirstName'))
          var FirstName = fileObj.fields.FirstName[0];
        if (fileObj.fields.hasOwnProperty('LastName'))
          var LastName = fileObj.fields.LastName[0];
        if (fileObj.fields.hasOwnProperty('email'))
          var email = fileObj.fields.email[0];
        if (fileObj.fields.hasOwnProperty('password'))
          var password = fileObj.fields.password[0];
        if (fileObj.fields.hasOwnProperty('Newsletter'))
          var Newsletter = fileObj.fields.Newsletter[0];
        if (fileObj.fields.hasOwnProperty('FacebookID'))
          var FacebookID = fileObj.fields.FacebookID[0];
        if (fileObj.fields.hasOwnProperty('GoogleID'))
          var GoogleID = fileObj.fields.GoogleID[0];
        if (fileObj.fields.hasOwnProperty('SavedBusiness'))
          var SavedBusiness = fileObj.fields.SavedBusiness[0];
        if (fileObj.fields.hasOwnProperty('EmailNotification'))
          var EmailNotification = fileObj.fields.EmailNotification[0];
        if (fileObj.fields.hasOwnProperty('PushNotification'))
          var PushNotification = fileObj.fields.PushNotification[0];

        Account.create({
          FirstName: FirstName,
          email: email,
          password: password,
          username: username,
          LastName: LastName,
          Newsletter: Newsletter,
          FacebookID: FacebookID,
          GoogleID: GoogleID,
          SavedBusiness: SavedBusiness,
          EmailNotification: EmailNotification,
          PushNotification: PushNotification

        }, function(err, ant) {
          if (err) {
             cb(null, err);   
          } else {
             cb(null, ant);
          }
        });
      }

    });
  };

  Account.afterRemote('addaccount', function(context, user, next) {
        console.log('> user.afterRemote triggered');

        var options = {
            type: 'email',
            to: user.email,
            from: 'even3co@gmail.com',
            subject: 'Welcome to Even3.',
            template: path.resolve(__dirname, '../../server/views/verify.ejs'),
            redirect: '/verified',
            Account: user
        };
        
        console.log('options = ' + JSON.stringify(options));
        
        if (user.hasOwnProperty('id')) {
            user.verify(options, function(err, response, next) {
            console.log('user verify response = ' + JSON.stringify(response));
            console.log('user verify error = ', JSON.stringify(err));
            if (err) return next(err);
            console.log('> verification email sent:', response);
            context.res.send({
                status : 'Success',
                message : 'Thanks for joining Even3. An activation link has been sent to your email. Please activate your account to use Even3.'
              });
            });
        } else {
            context.res.send({
                status : user['name'],
                message : user['message']
              });
        }
           
        
  });
  
  Account.afterRemote('create', function(context, user, next) {
        console.log('> user.afterRemote triggered');

        var options = {
            type: 'email',
            to: user.email,
            from: 'even3co@gmail.com',
            subject: 'Welcome to Even3.',
            template: path.resolve(__dirname, '../../server/views/verify.ejs'),
            redirect: '/verified',
            Account: user
        };
        
        console.log('options = ' + JSON.stringify(options));
         
        user.verify(options, function(err, response, next) {
            console.log('user verify response = ' + JSON.stringify(response));
            console.log('user verify error = ', JSON.stringify(err));
            if (err) return next(err);
            console.log('> verification email sent:', response);
        });
  });



  Account.editaccount = function(ctx, options, cb) {

    if (!options) options = {};
    ctx.req.params.container = 'profilepic';

    Account.app.models.container.upload(ctx.req, ctx.result, options, function(err, fileObj) {
      if (!fileObj.fields.hasOwnProperty('Id'))
        cb(err);
      else
        var Id = fileObj.fields.Id[0];
      if (err) {
        cb(err);
      }
      if (fileObj.files.hasOwnProperty('file')) {

        var fileInfo = fileObj.files.file[0];

        var extensionType = fileInfo.type.split('/');
        //console.log(extensionType);


        var fileCurrentPath = './server/storage/profilepic' + '/' + fileInfo.name;
        var newFilePath = './server/storage/profilepic' + '/' + Id + '.' + extensionType[1];

        fs.rename(fileCurrentPath, newFilePath, function(err) {
          if (err) throw err;
          //console.log('renamed complete');
        });

        Account.find({
          where: {
            "id": Id
          }
        }, function(err, ant) {
          if (err)
            cb(null, err);
          else {
            if (fileObj.fields.hasOwnProperty('email'))
              ant[0].email = fileObj.fields.email[0];
            if (fileObj.fields.hasOwnProperty('password'))
              ant[0].password = fileObj.fields.password[0];
            if (fileObj.fields.hasOwnProperty('username'))
              ant[0].username = fileObj.fields.username[0];
            if (fileObj.fields.hasOwnProperty('FirstName'))
              ant[0].FirstName = fileObj.fields.FirstName[0];
            if (fileObj.fields.hasOwnProperty('LastName'))
              ant[0].LastName = fileObj.fields.LastName[0];
            if (fileObj.fields.hasOwnProperty('Newsletter'))
              ant[0].Newsletter = fileObj.fields.Newsletter[0];
            if (fileObj.fields.hasOwnProperty('FacebookID'))
              ant[0].FacebookID = fileObj.fields.FacebookID[0];
            if (fileObj.fields.hasOwnProperty('GoogleID'))
              ant[0].GoogleID = fileObj.fields.GoogleID[0];
            if (fileObj.fields.hasOwnProperty('SavedBusiness'))
              ant[0].SavedBusiness = fileObj.fields.SavedBusiness[0];
            if (fileObj.fields.hasOwnProperty('EmailNotification'))
              ant[0].EmailNotification = fileObj.fields.EmailNotification[0];
            if (fileObj.fields.hasOwnProperty('PushNotification'))
              ant[0].PushNotification = fileObj.fields.PushNotification[0];
            ant[0].UserPicture = CONTAINERS_URL + fileInfo.container + '/download/' + ant[0].id + '.' + extensionType[1];
            ant[0].save();
            //ant[0].container="profilepic";
            //ant[0].UserPicture= ''+ant[0].id+'.'+extensionType[1];
            cb(null, ant[0]);
          }
        });
      } else {


        Account.find({
          where: {
            "id": Id
          }
        }, function(err, ant) {
          if (err)
            cb(null, err);
          else {
            // console.log('value is '+fileObj.fields.PushNotification[0]);
            if (fileObj.fields.hasOwnProperty('email'))
              ant[0].email = fileObj.fields.email[0];
            if (fileObj.fields.hasOwnProperty('password'))
              ant[0].password = fileObj.fields.password[0];
            if (fileObj.fields.hasOwnProperty('username'))
              ant[0].username = fileObj.fields.username[0];
            if (fileObj.fields.hasOwnProperty('FirstName'))
              ant[0].FirstName = fileObj.fields.FirstName[0];
            if (fileObj.fields.hasOwnProperty('LastName'))
              ant[0].LastName = fileObj.fields.LastName[0];
            if (fileObj.fields.hasOwnProperty('Newsletter'))
              ant[0].Newsletter = fileObj.fields.Newsletter[0];
            if (fileObj.fields.hasOwnProperty('FacebookID'))
              ant[0].FacebookID = fileObj.fields.FacebookID[0];
            if (fileObj.fields.hasOwnProperty('GoogleID'))
              ant[0].GoogleID = fileObj.fields.GoogleID[0];
            if (fileObj.fields.hasOwnProperty('SavedBusiness'))
              ant[0].SavedBusiness = fileObj.fields.SavedBusiness[0];
            if (fileObj.fields.hasOwnProperty('EmailNotification'))
              ant[0].EmailNotification = fileObj.fields.EmailNotification[0];
            if (fileObj.fields.hasOwnProperty('PushNotification'))
              ant[0].PushNotification = fileObj.fields.PushNotification[0];
            ant[0].save();
            cb(null, ant[0]);
          }

        });

      }

    });
  };



  Account.remoteMethod(
    'addaccount', {
      description: 'Uploads a file',
      accepts: [{
        arg: 'ctx',
        type: 'object',
        http: {
          source: 'context'
        }
      }, {
        arg: 'options',
        type: 'object',
        http: {
          source: 'query'
        }
      }],
      returns: {
        arg: 'fileObject',
        type: 'object',
        root: true
      },
      http: {
        verb: 'post'
      }
    }
  );


  Account.remoteMethod(
    'editaccount', {
      description: 'Uploads a file',
      accepts: [{
        arg: 'ctx',
        type: 'object',
        http: {
          source: 'context'
        }
      }, {
        arg: 'options',
        type: 'object',
        http: {
          source: 'query'
        }
      }],
      returns: {
        arg: 'fileObject',
        type: 'object',
        root: true
      },
      http: {
        verb: 'post'
      }
    }
  );

  Account.remoteMethod(
    'addtoken', {
      description: 'Adds a Token',
      accepts: {
        arg: 'data',
        type: 'object',
        http: {
          source: 'context'
        }
      },
      returns: {
        arg: 'message',
        type: 'string'
      },
      http: {
        verb: 'post'
      }
    }
  );



  Account.remoteMethod(
    'socialsignin', {
      description: 'Sign in with Google or facebook . credentials: a Json with Type(FB,Google),Id(facebook or google), email, FirstName,LastName',
      accepts: {
        arg: 'data',
        type: 'object',
        http: {
          source: 'context'
        }
      },

      returns: {
        arg: 'fileObject',
        type: 'object',
        root: true
      },

      http: {
        verb: 'post'
      }
    });

  Account.remoteMethod(
    'sendemail', {
      description: 'Sends An Email',
      accepts: {
        arg: 'data',
        type: 'object',
        http: {
          source: 'context'
        }
      },

      returns: {
        arg: 'message',
        type: 'string'
      },

      http: {
        verb: 'post'
      }

    });


  Account.remoteMethod(
    'passwordreset', {
      description: 'resets the password',
      accepts: {
        arg: 'data',
        type: 'object',
        http: {
          source: 'context'
        }
      },

      returns: {
        arg: 'fileObject',
        type: 'object',
        root: true
      },

      http: {
        verb: 'post'
      }

    });

  Account.remoteMethod(
    'invitefriend', {
      description: 'invites friends to participate in events',
      accepts: {
        arg: 'data',
        type: '[object]',
        http: {
          source: 'context'
        }
      },

      returns: {
        arg: 'message',
        type: 'string',
        root: true
      },

      http: {
        verb: 'post'
      }

    });

};
