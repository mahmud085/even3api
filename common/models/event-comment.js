var CONTAINERS_URL = '/containers/';
var fs = require('fs');
var path = require('path');
var loopback = require('loopback');
var app = module.exports = loopback();
module.exports = function(EventComment) {

	EventComment.addcomment = function(ctx, options, cb) {
		if (!options)
			options = {};
		ctx.req.params.container = 'eventcommentpic';
		EventComment.app.models.container.upload(ctx.req, ctx.result, options, function(err, fileObj) {
			if (err)
				cb(null, err);
			if (fileObj.files.hasOwnProperty('file')) {

				var fileInfo = fileObj.files.file[0];

				if (fileObj.fields.hasOwnProperty("CommentBody"))
					var CommentBody = fileObj.fields.CommentBody[0];

				if (fileObj.fields.hasOwnProperty("EventId"))
					var EventId = fileObj.fields.EventId[0];

				if (fileObj.fields.hasOwnProperty("BusinessId"))
					var BusinessId = fileObj.fields.BusinessId[0];

				if (fileObj.fields.hasOwnProperty("Id"))
					var Id = fileObj.fields.Id[0];

				if (fileObj.fields.hasOwnProperty("Time"))
					var Time = fileObj.fields.Time[0];

				//var Commenter =JSON.parse(JSON.stringify(ctx.req.accessToken.userId));
				EventComment.create({
					CommentBody: CommentBody,
					EventId: EventId,
					BusinessId: BusinessId,
					AccountId: Id,
					Time: Time
				}, function(err, eventcomment) {
					if (err)
						cb(null, err);
					console.log(fileInfo.name);
					var fileCurrentPath = './server/storage/eventcommentpic' + '/' + fileInfo.name;
					newFilePath = './server/storage/eventcommentpic' + '/' + eventcomment.id + '.jpg';
					fs.rename(fileCurrentPath, newFilePath, function(err) {
						if (err) throw err;
						//console.log('renamed complete');
					});
					eventcomment.CommentPicture = CONTAINERS_URL + fileInfo.container + '/download/' + eventcomment.id + '.jpg';
					eventcomment.save();
					cb(null, eventcomment);


				});
			} else {
				if (fileObj.fields.hasOwnProperty("CommentBody"))
					var CommentBody = fileObj.fields.CommentBody[0];

				if (fileObj.fields.hasOwnProperty("EventId"))
					var EventId = fileObj.fields.EventId[0];

				if (fileObj.fields.hasOwnProperty("BusinessId"))
					var BusinessId = fileObj.fields.BusinessId[0];

				if (fileObj.fields.hasOwnProperty("Id"))
					var Id = fileObj.fields.Id[0];

				if (fileObj.fields.hasOwnProperty("Time"))
					var Time = fileObj.fields.Time[0];
				EventComment.create({
					CommentBody: CommentBody,
					EventId: EventId,
					BusinessId: BusinessId,
					AccountId: Id,
					Time: Time
				}, function(err, eventcomment) {
					if (err)
						cb(null, err);
					cb(null, eventcomment);
				});
			}
		});

	};


	EventComment.afterRemote('addcomment', function(ctx, data, done) {

		console.log(data);

		if (data.EventId === undefined) {
			EventComment.app.models.Business.find({
				where: {
					'id': data.BusinessId
				}
			}, function(err, business) {
				if (!business[0])
					done();
				if (business[0])
					EventComment.app.models.Installation.find({
						where: {
							'userId': business[0].AccountId
						}
					}, function(err, device) {
						var notification = EventComment.app.models.Notification;
						device[0].badge++;
						var message = {
							EventId: data.EventId
						}
						EventComment.app.models.Account.find({
							where: {
								'id': data.AccountId
							}
						}, function(err, acnt) {
							if (acnt[0])
								message.text = '' + acnt[0].FirstName + ':' + data.CommentBody;

							var note = new notification({
								expirationInterval: 3600, // Expires 1 hour from now.
								badge: device[0].badge,
								sound: 'ping.aiff',
								message: message,
								messageFrom: 'Even3co'
							});

							EventComment.app.models.Push.notifyById(device[0].id, note, function(err) {

								if (err) {
									console.log(err);
									done();
								}
								if (!err) {
									device[0].save();
									console.log('pushing notification to %j', device[0].id);
									done();
								}

							});
						});
					});
			});
		} else {
			EventComment.app.models.Event.find({
				where: {
					'id': data.EventId
				}
			}, function(err, event) {
				if (!event[0])
					done();
				if (event[0])
					EventComment.app.models.Installation.find({
						where: {
							'userId': event[0].AccountId
						}
					}, function(err, device) {
						var notification = EventComment.app.models.Notification;
						device[0].badge++;
						var message = {
							EventId: data.EventId
						}
						EventComment.app.models.Account.find({
							where: {
								'id': data.AccountId
							}
						}, function(err, acnt) {
							if (acnt[0])
								message.text = '' + acnt[0].FirstName + ':' + data.CommentBody;

							var note = new notification({
								expirationInterval: 3600, // Expires 1 hour from now.
								badge: device[0].badge,
								sound: 'ping.aiff',
								message: message,
								messageFrom: 'Even3co'
							});

							EventComment.app.models.Push.notifyById(device[0].id, note, function(err) {

								if (err) {
									console.log(err);
									done();
								}
								if (!err) {
									device[0].save();
									console.log('pushing notification to %j', device[0].id);
									done();
								}

							});
						});
					});
			});
		}

		//done();
	});


	EventComment.remoteMethod(
		'addcomment', {
			http: {
				verb: 'post'
			},
			description: 'Uploads a file',
			accepts: [{
				arg: 'ctx',
				type: 'object',
				http: {
					source: 'context'
				}
			}, {
				arg: 'options',
				type: 'object',
				http: {
					source: 'query'
				}
			}],
			returns: {
				arg: 'fileObject',
				type: 'object',
				root: true
			}
		}
	);



};