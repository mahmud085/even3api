var loopback = require('loopback');
var app = module.exports = loopback();

module.exports = function(Participant) {

	Participant.afterRemote('create',function(ctx,data,done){

		Participant.app.models.Installation.find({where:{'userId': ctx.args.data.AccountId}},function(err,device){
		
       				if(err)
					done();

					console.log(device[0]);
					var notification = Participant.app.models.Notification;
					device[0].badge++;
		 
		 var note = new notification({
				   expirationInterval: 3600, // Expires 1 hour from now.
				   badge: device[0].badge,
				   sound: 'ping.aiff',
				   message:'You have invited a Event',
				   messageFrom: 'Ray'
				 });

		    Participant.app.models.Push.notifyById(device[0].id, note, function(err) {
				   
				   if (err) {
				     console.log(err);
				     done();
				   }
				   if(!err)
				   {
				   	device[0].save();
				   console.log('pushing notification to %j', device[0].id);
				   done();
				}
		
		    });

			
		});

	});



};
