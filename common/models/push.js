var loopback = require('loopback');
var app = module.exports = loopback();

module.exports = function(Push) {

    Push.sendNotification = function (userId, message) {
        console.log('sendNotification > to : ' + userId + " , message = " + message);
        if (!userId) {
            return ;
        }
        
       var note = new Notification({
            expirationInterval: 3600, // Expires 1 hour from now.
            badge: badge++,
            sound: 'ping.aiff',
            alert: message ,
            messageFrom: 'Even3'
      });
      
      Push.notifyById(userId, note, function (err) {
          if (err) {
          console.error('Cannot notify %j: %s', userId, err.stack);
          next(err);
          return;
        }
        console.log('pushing notification to %j', userId);
     });
};
