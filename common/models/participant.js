var loopback = require('loopback');
var app = module.exports = loopback();

module.exports = function(Participant) {


	Participant.afterRemote('create',function(ctx,data,done){
		
        console.log('after remote: perticipant create');
        console.log('perticipant create data = ' + JSON.stringify(data));
		
        Participant.app.models.Account.find({
            where:{'id' : ctx.args.data.AccountId}
        }, function (error, users) {
            if (users.length > 0) {
                var sender = users[0] ;
                Participant.app.models.Event.find({
                    where:{'id':ctx.args.data.EventId}
                },function(err,result) {                
                    var event = result[0];
			        if(event) {
                        Participant.app.models.Account({
                            where:{'id':result[0].AccountId}
                        },function(err,owner) {
                            var message = {
                                   EventId : ctx.args.data.EventId
                            };
                            if (ctx.args.data.Rsvp == 1) {
                                message.text = sender.FirstName + ' is not going to your event named ' + event.Name ;
                            } else if (ctx.args.data.Rsvp == 2) {
                                message.text = sender.FirstName + ' is going to your event named ' + event.Name ;
                            }
				            Participant.app.models.Push.sendNotification(owner[0].id, message);
                            done(); 
			            });    
                    }
		        });	
            } else {
                console.log('sender not found');
            }
        });
	});


	Participant.afterRemote('prototype.updateAttributes',function(ctx,data,done) {
	
	   Participant.app.models.Event.find({where: {'id': ctx.result.EventId}},function(err,result) {
		  if(result[0]&&ctx.args.data.Rsvp==1) {		
			 var time = new Date().getTime();
			 var kue = require('kue')
    	     var queue = kue.createQueue();
    	     var job = queue.create('alarm',{
       	           
               }).delay(time-result[0].StartDate).save();
               	
             queue.process('alarm', function(job,done) {
               	Participant.app.models.Installation.find({where:{'userId': ctx.result.AccountId}},function(err,device){
               		if(device[0]) {
               			var notification = Participant.app.models.Notification;
					    device[0].badge++;
						var message = {
							 EventId: ctx.args.data.EventId,
							 text: result[0].Name + ' is Going on.'
					     }

					     var note = new notification({
							 expirationInterval: 3600, // Expires 1 hour from now.
					    	 badge: device[0].badge,
							 sound: 'ping.aiff',
							 message:message,
							 messageFrom: 'Even3co'
						 });

		    Participant.app.models.Push.notifyById(device[0].id, note, function(err) {
				   
				   if (err) {
				     console.log(err);
				     done();
				   }
                   
				   if(!err) {
				   	 device[0].save();
				     console.log('pushing notification to %j', device[0].id);
				     done();
				   }
		    });

          }

         });


   	});	
		}

	});

	done();
	});
};
