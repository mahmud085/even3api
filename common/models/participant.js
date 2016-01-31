var loopback = require('loopback');
var app = module.exports = loopback();

module.exports = function(Participant) {

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
