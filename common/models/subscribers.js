module.exports = function(Subscribers) {

	Subscribers.sendMail = function(){

	}
	Subscribers.remoteMethod(
		'sendMail',
		{
			http: {
                verb: 'get'
            },
            description: 'send mail to all subscribers'

		}

	);
};
