var CONTAINERS_URL = '/containers/';
var loopback = require('loopback');
var app = module.exports = loopback();
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


    Event.search = function(data, cb) {

        var response = {};
        if (!data.req.body.Address && data.req.body.LocationLat && data.req.body.LocationLong) {
            Event.find({
                where: {
                    "LocationLat": data.req.body.LocationLat,
                    "LocationLong": data.req.body.LocationLong
                }
            }, function(err, event) {
                if (err) {
                    cb(null, err);
                }
                console.log(event);
                response = JSON.parse(JSON.stringify(event));
                cb(null, response);
            });

        }

        if (data.req.body.Address) {
            Event.find(function(err, event) {

                if (err) {
                    cb(null, err);
                }

                var res = JSON.parse(JSON.stringify(event));
                var result = [];
                for (sample in res) {
                    if (res[sample].hasOwnProperty('Address'))
                        if (res[sample].Address.toLowerCase().search(Address.toLowerCase()) != -1)
                            result.push(res[sample]);
                }

                cb(null, result);

            })
        }



    }

    Event.afterCreate=function(next){
    
        console.log(this.Name);
        console.log(this.id);
        eventId=this.id;

        var StartDate=this.StartDate;

        var date = new Date(StartDate);
        var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)+ ':' + ('0' + date.getSeconds()).slice(-2)+' '+'GMT';
        console.log(formattedDate);

        var actualDate=new Date(formattedDate);
        actualDate=actualDate.getTime();
        console.log("actualDate=",actualDate);



        var one_day=1000*60*60*24;
        var one_hr=1000*60*60;
        var min=1000*60;

        var currentTime=new Date();
        currentTime=currentTime.getTime();
        console.log("currentTime=",currentTime); 

        calc=StartDate-currentTime;

        console.log("calc= ",Math.round(calc/min));
     
        var kue=require('kue');
        var queue=kue.createQueue();
        
        var delay=(1000*60*43);
        var miliSecond=calc-delay;

        console.log("delay = ",miliSecond);

        var job=queue.create('event',{
            startDate:formattedDate
        })
        .delay(2000)
        .save(function(err){
            if(!err) console.log("job created "+job.id+" "+Date());
        });
        queue.process('event',function(job,done){ 
            console.log("1= "+job.id+" "+job.data.startDate+" "+Date());
            
            Event.app.models.Participant.find(
            {
                include: ['account','event'], 
                where: {
                    and:[{
                        "EventId":eventId
                    },{
                        "Rsvp":2
                    }]
                }
            },function(err,participant){
                if(err) {
                    console.log(err);
                }
                else{
                    console.log(participant);        
                    for(j=0;j<participant.length;j++){
                        var event = participant[j].event;
                        var eventName = "An Event" ;
                        if (event) {
                            eventName = event.Name ;
                        }
                        var firstName = participant[j].account.firstName;
                        var message="Hi "+  firstName + ",<br>Thanks for using Even3. This is a reminder of event, " + eventName + ", which is happenning tomorrow. Your participation is expected there. <br><br> Even3 Team" ;
                        Event.app.models.Push.sendEmail(participant[j].account.email, eventName + " is happenning tomorrow", message);
                    }
                }
            });
            


            done();
        });

        kue.Job.rangeByState( 'complete', 0, 100, 'asc', function( err, jobs ) {
          jobs.forEach( function( job ) {
            job.remove( function(){
              console.log( 'removed ', job.id );
            });
          });
        });
        queue.promote();


        next();
    };




    Event.createemptyevent = function(data, cb) {

        //console.log('Its Working');

        var response = {};

        Event.create({
            AccountId: data.req.body.Id
        }, function(err, event) {
            if (err) {
                response = 'Can not save';
                cb(null, response);
            }
            var response = {};
            response.id = event.id;
            response.link = 'eventurl/' + event.id;

            console.log(response);
            cb(null, response);
        });

    };



    Event.remoteMethod(
        'createemptyevent', {
            http: {
                path: '/createemptyevent',
                verb: 'post'
            },
            accepts: {
                arg: 'data',
                type: 'object',
                http: {
                    source: 'context'
                }
            },
            returns: {
                arg: 'res',
                type: 'object',
                'http': {
                    source: 'res'
                }
            }
        });

    Event.remoteMethod(
        'search', {
            http: {
                path: '/search',
                verb: 'post'
            },
            accepts: {
                arg: 'data',
                type: 'object',
                http: {
                    source: 'context'
                }
            },

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
            returns: {
                arg: 'res',
                type: 'object',
                'http': {
                    source: 'res'
                }
            }
        }
    );

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