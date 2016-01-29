var loopback = require('loopback');
var app = module.exports = loopback();

module.exports = function(Push) {

    Push.sendNotification = function (userId, message) {
        console.log('sendNotification > to : ' + userId + " , message = " + message);
        if (!userId) {
            return ;
        }
       var notification = Push.app.models.Notification;
       var note = new notification({
            expirationInterval: 3600, // Expires 1 hour from now.
            badge: 1,
            sound: 'ping.aiff',
            alert: message ,
            messageFrom: 'Even3'
      });
      
      this.notifyById(userId, note, function (err) {
        if (err) {
            console.error('Cannot notify %j: %s', userId, err.stack);
            return;
        }
        console.log('pushing notification to %j', userId);
     });
      
    }
};