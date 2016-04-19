module.exports = function(Interest) {
Interest.remoteMethod(
	'userinterest',
	{
		http : {'verb':'post'},
		accepts : {'arg':'allinterests','type':'object'},
		returns : {'arg':'message','type':'string'}
	}

);
Interest.userinterest = function (allinterests,cb){
	
	userId = allinterests.AccountId;
	names = allinterests.names;
	len = names.length;

	console.log("all names = ",names);
	for(i=0;i<len;i++){
		(function(item){

			Interest.findOne({
				where : { 'name' : names[item] }
			},function(err,result){
				if(err){
					console.log("Something wrong finding Interest!");
					throw err;
				}
				if(!result){
					var newInterest = {};
					var users = [];
					users.push({'AccountId':userId});
					newInterest.name = names[item];
					newInterest.users = users;
					Interest.create(newInterest,function(err,res){
						if(err){
							console.log("Not Able to create interest ",err);
							throw err;
						}
						else{
							console.log("successfull creation interest == ",res);
						}
					});
				}else{
					result.users.push({'AccountId':userId});
					result.save();
					console.log("result = ",result);
				}
			});
		})(i);
	}
	cb(null,"successfull!");
}

};
