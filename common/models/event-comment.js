var CONTAINERS_URL = '/containers/';
var fs = require('fs');
var path = require('path');
module.exports = function(EventComment) {
	
	EventComment.addcomment=function(ctx,options,cb){
		if(!options)
			options={};
		 ctx.req.params.container = 'eventcommentpic';
		 EventComment.app.models.container.upload(ctx.req,ctx.result,options,function (err,fileObj) {
		 	if(err)
		 		cb(null,err);
		 	if(fileObj.files.hasOwnProperty('file'))
		 	{		

		 		  var fileInfo = fileObj.files.file[0];
		 		  if(fileObj.fields.hasOwnProperty("CommentBody"))
		 		  var CommentBody= fileObj.fields.CommentBody[0];
		 		  if(fileObj.fields.hasOwnProperty("EventId"))
		 		  var EventId= fileObj.fields.EventId[0];	
                  if(fileObj.fields.hasOwnProperty("Id"))
		 		  var Id= fileObj.fields.Id[0];
		 		  if(fileObj.fields.hasOwnProperty("Time"))
		 		  var Time= fileObj.fields.Time[0];

		 		//var Commenter =JSON.parse(JSON.stringify(ctx.req.accessToken.userId));
		 	EventComment.create({
		 		CommentBody:CommentBody,
		 		EventId:EventId,
		 		AccountId:Id,
		 		Time:Time
		 	},function(err,eventcomment){
		 		if(err)
		 			cb(null,err);
		 		console.log(fileInfo.name);
       var fileCurrentPath= './server/storage/eventcommentpic'+'/'+fileInfo.name;
        newFilePath='./server/storage/eventcommentpic'+'/'+eventcomment.id+'.jpg';
                fs.rename(fileCurrentPath, newFilePath, function (err) {
            if (err) throw err;
            //console.log('renamed complete');
            });		 		
        eventcomment.CommentPicture=CONTAINERS_URL+fileInfo.container+'/download/'+eventcomment.id+'.jpg';
        eventcomment.save();
        cb(null,eventcomment);
		 	});
		 }
		 
		 else
		 {
		 		  if(fileObj.fields.hasOwnProperty("CommentBody"))
		 		  var CommentBody= fileObj.fields.CommentBody[0];
		 		  if(fileObj.fields.hasOwnProperty("EventId"))
		 		  var EventId= fileObj.fields.EventId[0];	 			
		 		  if(fileObj.fields.hasOwnProperty("Id"))
		 		  var Id= fileObj.fields.Id[0];
		 		  if(fileObj.fields.hasOwnProperty("Time"))
		 		  var Time= fileObj.fields.Time[0];
		 	EventComment.create({
		 		CommentBody:CommentBody,
		 		EventId:EventId,
		 		AccountId:Id,
		 		Time:Time
		 	},function(err,eventcomment){
		 		if(err)
		 			cb(null,err);
        cb(null,eventcomment);
		 	});
		 }
	});



};


	 EventComment.remoteMethod(
        'addcomment',
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
