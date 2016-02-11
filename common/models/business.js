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
                if(fileObj.fields.hasOwnProperty('BusinessCategoryId'))
                    var categoryId=fileObj.fields.BusinessCategoryId[0]; 

                if (fileObj.fields.hasOwnProperty("Phone"))
                    var Phone = fileObj.fields.Phone[0];
                if (fileObj.fields.hasOwnProperty("email"))
                    var email = fileObj.fields.email[0];
                if (fileObj.fields.hasOwnProperty("Website"))
                    var Website = fileObj.fields.Website[0];
                if (fileObj.fields.hasOwnProperty("valid"))
                    var valid = fileObj.fields.valid[0];               

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
                    if (LocationLat && LocationLong) {
                        busnes[0].Location= new loopback.GeoPoint({lat: LocationLat, lng: LocationLong});
                    };
                    busnes[0].Address=Address;
                    busnes[0].BusinessPicture=CONTAINERS_URL+fileInfo.container+'/download/'+Id+'.'+extensionType[1];
                    busnes[0].Description=Description;
                    busnes[0].BusinessCategoryId = categoryId;
                    busnes[0].Phone = Phone;
                    busnes[0].email = email ;
                    busnes[0].Website = Website ;
                    busnes[0].valid = valid;
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
                if(fileObj.fields.hasOwnProperty('BusinessCategoryId'))
                    var categoryId=fileObj.fields.BusinessCategoryId[0];

                if (fileObj.fields.hasOwnProperty("Phone"))
                    var Phone = fileObj.fields.Phone[0];
                if (fileObj.fields.hasOwnProperty("email"))
                    var email = fileObj.fields.email[0];
                if (fileObj.fields.hasOwnProperty("Website"))
                    var Website = fileObj.fields.Website[0];  
                if (fileObj.fields.hasOwnProperty("valid"))
                    var valid = fileObj.fields.valid[0];  

            Business.find({where:{"id":Id}},function(err,busnes){
                if(err)
                    console.log(err);
                else
                {
                    busnes[0].Name=Name;
                    if (LocationLat && LocationLong) {
                        busnes[0].Location= new loopback.GeoPoint({lat: LocationLat, lng: LocationLong});
                    };
                    busnes[0].Address=Address;
                    busnes[0].Description=Description;
                    busnes[0].BusinessCategoryId = categoryId;
                    busnes[0].Phone = Phone;
                    busnes[0].email = email ;
                    busnes[0].Website = Website ;
                    busnes[0].valid = valid;
                    busnes[0].save();       
                }
            cb(null,busnes[0]);
                });
     }
  });
};  




	Business.createemptybusiness = function(data,cb) {
    var response={};
    Business.create({AccountId:data.req.body.Id},function(err,business){
    	if(err)
    	{
    		response='Can not save';
    		cb(null, response);
    	}    		
    	response='Businessurl/'+ business.id;
    	console.log(response);
    	cb(null, response);
    });
};

    Business.search=function(data,cb){

        var response={};
        if(!data.req.body.Address&&data.req.body.LocationLat&&data.req.body.LocationLong)
        {
            Event.find({where:{"LocationLat":data.req.body.LocationLat,"LocationLong":data.req.body.LocationLong}},function(err,event){
                if(err)
                {
                    cb(null,err);
                }
                console.log(event);
                response=JSON.parse(JSON.stringify(event));
                cb(null,response);
            });

        }

        if(data.req.body.Address)
        {
            Event.find(function(err,event){

                if(err)
                {
                    cb(null,err);
                }

               var res=JSON.parse(JSON.stringify(event));
               var result=[];
               for(sample in res)
                {        
                            if(res[sample].hasOwnProperty('Address'))
                            if(res[sample].Address.toLowerCase().search(Address.toLowerCase())!=-1)
                                result.push(res[sample]);                        
                }
              
            cb(null,result);
                            
            })
        }

     

    };




Business.remoteMethod(
	'createemptybusiness',
	{
		http: {path: '/createemptybusiness', verb: 'post'},
		accepts: { arg: 'data', type: 'object', http: { source: 'context' } },
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

   Business.remoteMethod(
    'search',
    {
      http: {path: '/search', verb: 'post'},
      accepts: { arg: 'data', type: 'object', http: { source: 'context' } },

      /*[{ 
        arg: 'LocationLat', 
        type: 'number'
      },
      { 
        arg: 'LocationLong', 
        type: 'number'
      },
        { 
        arg: 'Address', 
        type: 'string'
      }
  ],*/
      returns: {arg: 'res', type: 'object', 'http': {source: 'res'}}
    }
  );

};
