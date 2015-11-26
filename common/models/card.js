


module.exports = function(Card) {



Card.stripepayment = function (data,cb) {



		if(data.req.body.isTest==true)
		var stripe = require("stripe")("sk_test_NvxNY3Ph9h2vqH9SAGOLdobD");
		else
		var stripe = require("stripe")("sk_live_rppF6b0bLRS5sh0zFDXK1njt");
		
		var stripeToken = data.req.body.stripeToken;

		var charge = stripe.charges.create({
		  amount: data.req.body.amount, // amount in cents, again
		  currency: data.req.body.currency,
		  source: stripeToken,
		  description: data.req.body.description
		}, function(err, charge) {
			console.log(err);
		  if(charge)
		  	cb(null, {"payment" : charge });
		  else
		  	cb(err);
		});



};




Card.remoteMethod(
        'stripepayment',
        {
          description: 'invites friends to participate in events',
          accepts:{ arg: 'data', type: '[object]', http: { source: 'context' } },
              
          returns:{
           arg: 'message', type: 'string', root: true
          },

          http: {verb: 'post'}

        });

};
