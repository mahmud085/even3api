var CONTAINERS_URL = '/containers/';
var loopback = require('loopback');
var app = module.exports = loopback();
var fs = require('fs');


module.exports = function(Business) {

    Business.editbusiness = function (ctx,options,cb) {
        if(!options) options = {};
        ctx.req.params.container = 'businesspic';
      Business.app.models.container.upload(ctx.req,ctx.result,options,function (err,fileObj) {
            if(err) {
                cb(null,err);
            } 
            if(fileObj.files.hasOwnProperty('file'))
             { 
                var fileInfo = fileObj.files.file[0];
                if(fileObj.fields.hasOwnProperty('Id'))
                    var Id=fileObj.fields.Id[0];
                if(fileObj.fields.hasOwnProperty('Name'))
                    var Name=fileObj.fields.Name[0];
                if(fileObj.fields.hasOwnProperty('LocationLat'))
                    var LocationLat=fileObj.fields.LocationLat[0];
                if(fileObj.fields.hasOwnProperty('LocationLong'))
                    var LocationLong=fileObj.fields.LocationLong[0];
                if(fileObj.fields.hasOwnProperty('Address'))
                    var Address=fileObj.fields.Address[0];                
                if(fileObj.fields.hasOwnProperty('Description'))
                    var Description=fileObj.fields.Description[0];                

            var extensionType= fileInfo.type.split('/');
            var fileCurrentPath= './server/storage/businesspic'+'/'+fileInfo.name;
            newFilePath='./server/storage/businesspic'+'/'+Id+'.'+extensionType[1];

            fs.rename(fileCurrentPath, newFilePath, function (err) {
            if (err) throw err;
            //console.log('renamed complete');
            });
            Business.find({where:{"id":Id}},function(err,busnes){
                if(err)
                    console.log(err);
                else
                {
                    busnes[0].Name=Name;
                    busnes[0].LocationLat=LocationLat;
                    busnes[0].LocationLong=LocationLong;
                    busnes[0].Address=Address;
                    busnes[0].BusinessPicture=CONTAINERS_URL+fileInfo.container+'/download/'+Id+'.'+extensionType[1];
                    busnes[0].Description=Description;
                    busnes[0].save();       
                }

            cb(null,busnes[0]);
                });
    }
     else
     {
                if(fileObj.fields.hasOwnProperty('Id'))
                    var Id=fileObj.fields.Id[0];
                if(fileObj.fields.hasOwnProperty('Name'))
                    var Name=fileObj.fields.Name[0];
                if(fileObj.fields.hasOwnProperty('LocationLat'))
                    var LocationLat=fileObj.fields.LocationLat[0];
                if(fileObj.fields.hasOwnProperty('LocationLong'))
                    var LocationLong=fileObj.fields.LocationLong[0];
                if(fileObj.fields.hasOwnProperty('Address'))
                    var Address=fileObj.fields.Address[0];                
                if(fileObj.fields.hasOwnProperty('Description'))
                    var Description=fileObj.fields.Description[0];  
            Business.find({where:{"id":Id}},function(err,busnes){
                if(err)
                    console.log(err);
                else
                {
                    busnes[0].Name=Name;
                    busnes[0].LocationLat=LocationLat;
                    busnes[0].LocationLong=LocationLong;
                    busnes[0].Address=Address;
                    busnes[0].Description=Description;
                    busnes[0].save();       
                }
            cb(null,busnes[0]);
                });
     }
  });
};  




	Business.createemptybusiness = function(AccountId,cb) {
    var response={};
    Business.create({AccountId:AccountId},function(err,business){
    	if(err)
    	{
    		response='Can not save';
    		cb(null, response);
    	}    		
    	response='Businessurl/'+business.id;
    	console.log(response);
    	cb(null, response);
    });
};


Business.remoteMethod(
	'createemptybusiness',
	{
		http: {path: '/createemptybusiness', verb: 'post'},
		accepts: [{ 
			arg: 'AccountId', 
			type: 'string'
		}
		],
		returns: {arg: 'res', type: 'string', 'http': {source: 'res'}}
	});
 Business.remoteMethod(
        'editbusiness',
        {  http: {verb: 'post'},
            description: 'Uploads a file',
            accepts: [
                { arg: 'ctx', type: 'object', http: { source:'context' } },
                { arg: 'options', type: 'object', http:{ source: 'query'} }
            ],
            returns: {
                arg: 'fileObject', type: 'object', root: true
            }
        }
    );

};
