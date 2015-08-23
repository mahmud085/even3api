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

		 		var Commenter =JSON.parse(JSON.stringify(ctx.req.accessToken.userId));
		 	EventComment.create({
		 		CommentBody:CommentBody,
		 		EventId:EventId,
		 		Commenter:Commenter
		 	},function(err,eventcomment){
		 		if(err)
		 			cb(null,err);
       var fileCurrentPath= './server/storage/eventcommentpic'+'/'+fileInfo.name;
        newFilePath='./server/storage/eventcommentpic'+'/'+eventcomment.id+'.jpg';		 		
        eventcomment.UserPicture=newFilePath;
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
		 	EventComment.create({
		 		CommentBody:CommentBody,
		 		EventId:EventId,
		 		Commenter:ctx.req.accessToken.userId
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
