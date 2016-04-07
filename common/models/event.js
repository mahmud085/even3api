var CONTAINERS_URL = '/containers/';
var loopback = require('loopback');
var app = loopback();
var fs = require('fs');
var moment = require('moment');

module.exports = function(Event) {


    Event.deleteevent = function(cb) {
        Event.destroyAll(function(err, result) {
            if (err)
                cb(err);
            cb(true, 'Deleted');
        });

    }


    Event.editevent = function(ctx, options, cb) {

        if (!options) options = {};
        ctx.req.params.container = 'eventpic';
        //console.log(ctx.req.query);
        Event.app.models.container.upload(ctx.req, ctx.result, options, function(err, fileObj) {

            if (err) {
                cb(err);
            }
            if (fileObj.files.hasOwnProperty('file')) {
                var fileInfo = fileObj.files.file[0];
                if (fileObj.fields.hasOwnProperty("Id"))
                    var Id = fileObj.fields.Id[0];
                var extensionType = fileInfo.type.split('/');
                var fileCurrentPath = './server/storage/eventpic' + '/' + fileInfo.name;
                newFilePath = './server/storage/eventpic' + '/' + Id + '.' + extensionType[1];

                fs.rename(fileCurrentPath, newFilePath, function(err) {
                    if (err) throw err;
                    //console.log('renamed complete');
                });

                Event.find({
                    where: {
                        "id": Id
                    }
                }, function(err, evnt) {
                    if (err)
                        console.log(err);
                    else {
                        if (fileObj.fields.hasOwnProperty('Description'))
                            evnt[0].Description = fileObj.fields.Description[0];
                        if (fileObj.fields.hasOwnProperty("Name"))
                            evnt[0].Name = fileObj.fields.Name[0];
                        if (fileObj.fields.hasOwnProperty("StartDate"))
                            evnt[0].StartDate = fileObj.fields.StartDate[0];
                        if (fileObj.fields.hasOwnProperty("EndDate"))
                            evnt[0].EndDate = fileObj.fields.EndDate[0];
                        if (fileObj.fields.hasOwnProperty("LocationLat"))
                            var LocationLat = fileObj.fields.LocationLat[0];

                        if (fileObj.fields.hasOwnProperty("LocationLong"))
                            var LocationLong = fileObj.fields.LocationLong[0];

                        if (LocationLat && LocationLong) {
                            evnt[0].Location = new loopback.GeoPoint({
                                lat: LocationLat,
                                lng: LocationLong
                            });
                        }

                        if (fileObj.fields.hasOwnProperty("status"))
                            evnt[0].status = fileObj.fields.status[0];

                        if (fileObj.fields.hasOwnProperty("Address"))
                            evnt[0].Address = fileObj.fields.Address[0];
                        if (fileObj.fields.hasOwnProperty("EventCategoryId"))
                            evnt[0].EventCategoryId = fileObj.fields.EventCategoryId[0];
                        if (fileObj.fields.hasOwnProperty("Phone"))
                            evnt[0].Phone = fileObj.fields.Phone[0];
                        if (fileObj.fields.hasOwnProperty("email"))
                            evnt[0].email = fileObj.fields.email[0];
                        if (fileObj.fields.hasOwnProperty("Website"))
                            evnt[0].Website = fileObj.fields.Website[0];

                        evnt[0].EventPicture = CONTAINERS_URL + fileInfo.container + '/download/' + Id + '.' + extensionType[1];
                        evnt[0].save();
                        cb(null, evnt[0]);
                    }

                });
            } else {
                if (fileObj.fields.hasOwnProperty('Description'))
                    var Description = fileObj.fields.Description[0];
                if (fileObj.fields.hasOwnProperty('Id'))
                    var Id = fileObj.fields.Id[0];
                if (fileObj.fields.hasOwnProperty('Name'))
                    var Name = fileObj.fields.Name[0];
                if (fileObj.fields.hasOwnProperty('LocationLat'))
                    var LocationLat = fileObj.fields.LocationLat[0];
                if (fileObj.fields.hasOwnProperty('LocationLong'))
                    var LocationLong = fileObj.fields.LocationLong[0];
                if (fileObj.fields.hasOwnProperty('Address'))
                    var Address = fileObj.fields.Address[0];
                if (fileObj.fields.hasOwnProperty('StartDate'))
                    var StartDate = fileObj.fields.StartDate[0];
                if (fileObj.fields.hasOwnProperty('EndDate'))
                    var EndDate = fileObj.fields.EndDate[0];
                if (fileObj.fields.hasOwnProperty("EventCategoryId"))
                    var EventCategoryId = fileObj.fields.EventCategoryId[0];
                if (fileObj.fields.hasOwnProperty("Phone"))
                    var Phone = fileObj.fields.Phone[0];
                if (fileObj.fields.hasOwnProperty("email"))
                    var email = fileObj.fields.email[0];
                if (fileObj.fields.hasOwnProperty("Website"))
                    var Website = fileObj.fields.Website[0];
                if (fileObj.fields.hasOwnProperty("status"))
                    var status = fileObj.fields.status[0];

                Event.find({
                    where: {
                        "id": Id
                    }
                }, function(err, evnt) {
                    if (err)
                        console.log(err);
                    else {

                        evnt[0].Name = Name;
                        evnt[0].Description = Description;
                        if (LocationLat && LocationLong)
                            evnt[0].Location = new loopback.GeoPoint({
                                lat: LocationLat,
                                lng: LocationLong
                            });
                        evnt[0].Address = Address;
                        evnt[0].StartDate = StartDate;
                        evnt[0].EndDate = EndDate;
                        evnt[0].EventCategoryId = EventCategoryId;
                        evnt[0].Phone = Phone;
                        evnt[0].email = email;
                        evnt[0].Website = Website;
                        evnt[0].status = status;
                        evnt[0].save();
                    }
                    cb(null, evnt[0]);
                });

            }

        });
    };


    Event.newEvent = function(ctx, options, cb) {

            console.log("Context = ",ctx.req.body);

            if (!options) options = {};
            ctx.req.params.container = 'eventpic';
        
        Event.app.models.container.upload(ctx.req, ctx.result, options, function(err, fileObj) {
            
            if (err) {
                console.log("Err = ",err);
                cb(err);
            }
             console.log("file object = ",fileObj);


            var evnt={};
            
            if (fileObj.fields.hasOwnProperty('Description'))
                 evnt.Description = fileObj.fields.Description[0];
            if (fileObj.fields.hasOwnProperty("Name"))
                 evnt.Name = fileObj.fields.Name[0];
            if (fileObj.fields.hasOwnProperty("StartDate"))
                 evnt.StartDate = fileObj.fields.StartDate[0];
            if (fileObj.fields.hasOwnProperty("EndDate"))
                 evnt.EndDate = fileObj.fields.EndDate[0];
            if (fileObj.fields.hasOwnProperty("LocationLat"))
                 var LocationLat = fileObj.fields.LocationLat[0];

            if (fileObj.fields.hasOwnProperty("LocationLong"))
                 var LocationLong = fileObj.fields.LocationLong[0];

            if (LocationLat && LocationLong) {
                  evnt.Location = new loopback.GeoPoint({
                       lat: LocationLat,
                       lng: LocationLong
                   });
               }

            if (fileObj.fields.hasOwnProperty("status"))
                evnt.status = fileObj.fields.status[0];

            if (fileObj.fields.hasOwnProperty("Address"))
                evnt.Address = fileObj.fields.Address[0];
            if (fileObj.fields.hasOwnProperty("EventCategoryId"))
                evnt.EventCategoryId = fileObj.fields.EventCategoryId[0];
            if (fileObj.fields.hasOwnProperty("Phone"))
                evnt.Phone = fileObj.fields.Phone[0];
            if (fileObj.fields.hasOwnProperty("email"))
                evnt.email = fileObj.fields.email[0];
            if (fileObj.fields.hasOwnProperty("Website"))
                evnt.Website = fileObj.fields.Website[0];
            if (fileObj.fields.hasOwnProperty("AccountId"))
                evnt.AccountId = fileObj.fields.AccountId[0];

            
            if (fileObj.files.hasOwnProperty('file')) {
                
                var fileInfo = fileObj.files.file[0];
                var date=new Date();
                var Id=date.getTime();
                var extensionType = fileInfo.type.split('/');
                var fileCurrentPath = './server/storage/eventpic' + '/' + fileInfo.name;
                var newFilePath = './server/storage/eventpic' + '/' + Id + '.' + extensionType[1];

                fs.rename(fileCurrentPath, newFilePath, function(err) {
                    if (err) {
                         console.log('rename err= ',err);
                        throw err;
                    } else {
                        evnt.EventPicture = CONTAINERS_URL + fileInfo.container + '/download/' + Id + '.' + extensionType[1];   
                    
                        Event.create(evnt,function(err,result){
                            if(err){
                                console.log("err2=",err);
                                throw err;
                            } else{
                                console.log("Successfully Created ! = ",result);
                                cb(null,result);
                            }
                        }); 
                    }
                });
            } else {
                Event.create(evnt,function(err,result){
                    if(err){
                        console.log("err2=",err);
                        throw err;
                    }
                    else{
                        console.log("Successfully Created ! = ",result);
                        cb(null,result);
                    }
                }); 
            }   
           
        });

    };


    Event.afterCreate=function(next){
  
        var estimatedDelay = 5000 ;
        var testDelay = 60 * 1000 ;
        eventId = this.id;
        eventName = this.Name;

        var StartDate = this.StartDate;
        var date = new Date(StartDate);

        var currentTime = new Date();
        currentTime = currentTime.getTime();
        console.log("currentTime=",currentTime); 

        var notificationTime = StartDate - estimatedDelay ;
        var delay = notificationTime - currentTime ;

        var kue = require('kue');                 
        var queue = kue.createQueue();
        
        var job = queue.create(eventId, {
            StartDate:StartDate,
            EventId:eventId,
            Name:eventName
        }).delay(testDelay).save(function(err){
            if (err) {
               console.log("queue create error = " + err); 
            } 
            console.log("job created with " + job.id + " at" + Date());
        });

        // Process every job that are created

        queue.process(eventId, function(job,done) {                                     
            console.log("job processing = " + JSON.stringify(job.data));
            
            Event.findOne({id:eventId}, function (error, event) {
                if (event) {
                    notifyUser(job);
                } else {
                    job.remove(function(err) {
                        if (err) {
                            throw err;
                        }
                        console.log('removed completed job ' + job.id);
                    });
                }
            });
            done();
        });
        
        queue.promote();
        next();
    };


var notifyUser = function (job) {
     Event.app.models.Participant.find({
                where: {
                    and:[{
                        "EventId":job.data.EventId
                    },{
                        "Rsvp":2
                    }]
                }
            },function(err,participant){
                console.log("All Participant = ",participant);
                if(err) {
                    console.log(err);
                } else {
                    for(j=0;j<participant.length;j++) {
                       (function(item) {
                            accountId = participant[item].AccountId;
                            Event.app.models.Account.find({
                                where:
                                {
                                    id:accountId
                                }
                            },function(err,result){
                                if(err){
                                    console.log(err);
                                }
                                else if(!result[0]){
                                    console.log("No Participant!");
                                }
                                else{
                                    console.log("result = ",result);
                                    var firstName = result[0].FirstName;
                                    var email=result[0].email;
                                    console.log("Email = ",email);

                                    if(!email){
                                        console.log(err);
                                        throw err;
                                    }

                                    var message = "Hi "+  firstName + ",<br>Thanks for using Even3. This is a reminder of event <strong>" + job.data.Name + "</strong> which is happenning tomorrow. Your participation is expected there. <br><br> Even3 Team" ;
                                    Event.app.models.Push.sendEmail(email, job.data.Name + " is happenning tomorrow", message);
                                }
                            });
                       })(j); 
                   
                    } 
                }
            });
}


Event.editevent = function(ctx, options, cb) {

        if (!options) options = {};
        ctx.req.params.container = 'eventpic';
        //console.log(ctx.req.query);
        Event.app.models.container.upload(ctx.req, ctx.result, options, function(err, fileObj) {

            if (err) {
                cb(err);
            }
            if (fileObj.files.hasOwnProperty('file')) {
                var fileInfo = fileObj.files.file[0];
                if (fileObj.fields.hasOwnProperty("Id"))
                    var Id = fileObj.fields.Id[0];
                var extensionType = fileInfo.type.split('/');
                var fileCurrentPath = './server/storage/eventpic' + '/' + fileInfo.name;
                newFilePath = './server/storage/eventpic' + '/' + Id + '.' + extensionType[1];

                fs.rename(fileCurrentPath, newFilePath, function(err) {
                    if (err) throw err;
                    //console.log('renamed complete');
                });

                Event.find({
                    where: {
                        "id": Id
                    }
                }, function(err, evnt) {
                    if (err)
                        console.log(err);
                    else {
                        if (fileObj.fields.hasOwnProperty('Description'))
                            evnt[0].Description = fileObj.fields.Description[0];
                        if (fileObj.fields.hasOwnProperty("Name"))
                            evnt[0].Name = fileObj.fields.Name[0];
                        if (fileObj.fields.hasOwnProperty("StartDate"))
                            evnt[0].StartDate = fileObj.fields.StartDate[0];
                        if (fileObj.fields.hasOwnProperty("EndDate"))
                            evnt[0].EndDate = fileObj.fields.EndDate[0];
                        if (fileObj.fields.hasOwnProperty("LocationLat"))
                            var LocationLat = fileObj.fields.LocationLat[0];

                        if (fileObj.fields.hasOwnProperty("LocationLong"))
                            var LocationLong = fileObj.fields.LocationLong[0];

                        if (LocationLat && LocationLong) {
                            evnt[0].Location = new loopback.GeoPoint({
                                lat: LocationLat,
                                lng: LocationLong
                            });
                        }

                        if (fileObj.fields.hasOwnProperty("status"))
                            evnt[0].status = fileObj.fields.status[0];

                        if (fileObj.fields.hasOwnProperty("Address"))
                            evnt[0].Address = fileObj.fields.Address[0];
                        if (fileObj.fields.hasOwnProperty("EventCategoryId"))
                            evnt[0].EventCategoryId = fileObj.fields.EventCategoryId[0];
                        if (fileObj.fields.hasOwnProperty("Phone"))
                            evnt[0].Phone = fileObj.fields.Phone[0];
                        if (fileObj.fields.hasOwnProperty("email"))
                            evnt[0].email = fileObj.fields.email[0];
                        if (fileObj.fields.hasOwnProperty("Website"))
                            evnt[0].Website = fileObj.fields.Website[0];

                        evnt[0].EventPicture = CONTAINERS_URL + fileInfo.container + '/download/' + Id + '.' + extensionType[1];
                        evnt[0].save();
                        cb(null, evnt[0]);
                    }

                });
            } else {
                if (fileObj.fields.hasOwnProperty('Description'))
                    var Description = fileObj.fields.Description[0];
                if (fileObj.fields.hasOwnProperty('Id'))
                    var Id = fileObj.fields.Id[0];
                if (fileObj.fields.hasOwnProperty('Name'))
                    var Name = fileObj.fields.Name[0];
                if (fileObj.fields.hasOwnProperty('LocationLat'))
                    var LocationLat = fileObj.fields.LocationLat[0];
                if (fileObj.fields.hasOwnProperty('LocationLong'))
                    var LocationLong = fileObj.fields.LocationLong[0];
                if (fileObj.fields.hasOwnProperty('Address'))
                    var Address = fileObj.fields.Address[0];
                if (fileObj.fields.hasOwnProperty('StartDate'))
                    var StartDate = fileObj.fields.StartDate[0];
                if (fileObj.fields.hasOwnProperty('EndDate'))
                    var EndDate = fileObj.fields.EndDate[0];
                if (fileObj.fields.hasOwnProperty("EventCategoryId"))
                    var EventCategoryId = fileObj.fields.EventCategoryId[0];
                if (fileObj.fields.hasOwnProperty("Phone"))
                    var Phone = fileObj.fields.Phone[0];
                if (fileObj.fields.hasOwnProperty("email"))
                    var email = fileObj.fields.email[0];
                if (fileObj.fields.hasOwnProperty("Website"))
                    var Website = fileObj.fields.Website[0];
                if (fileObj.fields.hasOwnProperty("status"))
                    var status = fileObj.fields.status[0];

                Event.find({
                    where: {
                        "id": Id
                    }
                }, function(err, evnt) {
                    if (err)
                        console.log(err);
                    else {

                        evnt[0].Name = Name;
                        evnt[0].Description = Description;
                        if (LocationLat && LocationLong)
                            evnt[0].Location = new loopback.GeoPoint({
                                lat: LocationLat,
                                lng: LocationLong
                            });
                        evnt[0].Address = Address;
                        evnt[0].StartDate = StartDate;
                        evnt[0].EndDate = EndDate;
                        evnt[0].EventCategoryId = EventCategoryId;
                        evnt[0].Phone = Phone;
                        evnt[0].email = email;
                        evnt[0].Website = Website;
                        evnt[0].status = status;
                        evnt[0].save();
                    }
                    cb(null, evnt[0]);
                });

            }

        });
    };

   

    Event.remoteMethod(
        'editevent', {
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
     Event.remoteMethod(
        'newEvent', {
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
            }
            ],
            returns: {
                arg: 'fileObject',
                type: 'object',
                root: true
            }
        }
    );

    Event.remoteMethod(
        'deleteevent', {
            http: {
                verb: 'post'
            },
            description: 'Deletes All the Events',

            returns: {
                arg: 'fileObject',
                type: 'object',
                root: true
            }
        }
    );


};