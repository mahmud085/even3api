var loopback = require('loopback');
var app = module.exports = loopback();

module.exports = function(Push) {

    Push.sendNotification = function (userId, message) {
        console.log('sendNotification > to : ' + userId + " , message = " + message);
        if (!userId) {
            return ;
        }
        
        Push.app.models.Installation.find({
            where : {"userId" : userId}
        }, function (error, devices) {
            if (!error) {
                console.log('devices installed count = ' + devices.length);
                if (devices.length > 0) {
                    var notification = Push.app.models.Notification;
                    var note = new notification({
                            expirationInterval: 3600, // Expires 1 hour from now.
                            badge: 1,
                            sound: 'ping.aiff',
                            alert: message ,
                            messageFrom: 'Even3'
                    });
                    
                    Push.notifyById(devices[0].id, note, function (err) {
                        if (err) {
                            console.error('Cannot notify %j: %s', userId, err.stack);
                            return;
                        }
                        console.log('pushing notification to %j', userId);
                    });
                }
            } else {
                console.log("push installation error = " + error);
            }
        });
       
    }
};