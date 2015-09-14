var loopback = require('loopback');
var app = module.exports = loopback();
var fs = require('fs');

module.exports = function(Event) {

     Event.editevent = function (ctx,options,cb) {
        if(!options) options = {};
        ctx.req.params.container = 'eventpic';
           //console.log(ctx.req.query);
      Event.app.models.container.upload(ctx.req,ctx.result,options,function (err,fileObj) {
            if(err) {
                cb(err);
            }  if(fileObj.files.hasOwnProperty('file'))
             {
            var fileInfo = fileObj.files.file[0];
            if(fileObj.fields.hasOwnProperty("Id"))
            var Id=fileObj.fields.Id[0];
            var extensionType= fileInfo.type.split('/');
            var fileCurrentPath= './server/storage/eventpic'+'/'+fileInfo.name;
            newFilePath='./server/storage/eventpic'+'/'+Id+'.'+extensionType[1];

            fs.rename(fileCurrentPath, newFilePath, function (err) {
            if (err) throw err;
            //console.log('renamed complete');
            });

            Event.find({where:{"id":Id}},function(err,evnt){
                if(err)
                    console.log(err);
                else
                {
                    if(fileObj.fields.hasOwnProperty('Description'))
                    evnt[0].Description=fileObj.fields.Description[0];
                    if(fileObj.fields.hasOwnProperty("Name"))
                    evnt[0].Name=fileObj.fields.Name[0];
                    if(fileObj.fields.hasOwnProperty("StartDate"))
                    evnt[0].StartDate=fileObj.fields.StartDate[0];
                    if(fileObj.fields.hasOwnProperty("EndDate"))
                    evnt[0].EndDate=fileObj.fields.EndDate[0];
                    if(fileObj.fields.hasOwnProperty("LocationLat"))
                    evnt[0].LocationLat=fileObj.fields.LocationLat[0];
                    if(fileObj.fields.hasOwnProperty("LocationLong"))
                    evnt[0].LocationLong=fileObj.fields.LocationLong[0];
                    if(fileObj.fields.hasOwnProperty("Address"))
                    evnt[0].Address=fileObj.fields.Address[0];
                    evnt[0].EventPicture=newFilePath;
                    evnt[0].save();
                    cb(null,evnt[0]);
                }

                });
    }
    else
    {
                if(fileObj.fields.hasOwnProperty('Description'))
                    var Description=fileObj.fields.Description[0];
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
                if(fileObj.fields.hasOwnProperty('StartDate'))
                    var StartDate=fileObj.fields.StartDate[0];  
                if(fileObj.fields.hasOwnProperty('EndDate'))
                    var EndDate=fileObj.fields.EndDate[0];                  
            Event.find({where:{"id":Id}},function(err,evnt){
                if(err)
                    console.log(err);
                else
                {   

                    evnt[0].Name=Name;
                    evnt[0].Description=Description;
                    evnt[0].LocationLat=LocationLat;
                    evnt[0].LocationLong=LocationLong;
                    evnt[0].Address=Address;
                    evnt[0].StartDate=StartDate;
                    evnt[0].EndDate=EndDate;
                    evnt[0].save();       
                }
            cb(null,evnt[0]);
                });

    }

  });
};


    Event.search=function(LocationLat,LocationLong,Address,cb){

        var response={};
        if(!Address&&LocationLat&&LocationLong)
        {
            Event.find({where:{"LocationLat":LocationLat,"LocationLong":LocationLong}},function(err,event){
                if(err)
                {
                    cb(null,err);
                }
                console.log(event);
                response=JSON.parse(JSON.stringify(event));
                cb(null,response);
            });

        }

        if(Address)
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

     

    }



	Event.createemptyevent = function(AccountId,cb) {

    //console.log('Its Working');

    var response={};

    Event.create({AccountId:AccountId},function(err,event){
    	if(err)
    	{
    		response='Can not save';
    		cb(null, response);
    	}
        var response={};
        response.id=event.id;
    	response.link='eventurl/'+event.id;

    	console.log(response);
    	cb(null, response);
    });

    
};



Event.remoteMethod(
	'createemptyevent',
	{
		http: {path: '/createemptyevent', verb: 'post'},
		accepts: [{ 
			arg: 'AccountId', 
			type: 'string'
		}
		],
		returns: {arg: 'res', type: 'object', 'http': {source: 'res'}}
	});

  Event.remoteMethod(
    'search',
    {
      http: {path: '/search', verb: 'post'},
      accepts: [{ 
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
  ],
      returns: {arg: 'res', type: 'object', 'http': {source: 'res'}}
    }
  );

 Event.remoteMethod(
        'editevent',
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
