var CONTAINERS_URL = '/containers/';
var loopback = require('loopback');
var app = module.exports = loopback();
var fs = require('fs');
var path = require('path');
var AccessToken = loopback.AccessToken;

module.exports = function(Account) {



/*
// Social Signin 

Account.socialsignin = function(data,cb)
{ 

if(data.req.body.Type=='FB')
Account.find({where:{"FacebookID":data.req.body.Id}},function(err,ant){
          if(err)
            cb(null,err);
          if(ant[0]==undefined)
          {
              //console.log(data.req.body.Id);
                  Account.create({
        FirstName:data.req.body.FirstName,
        email:data.req.body.email,
        password: data.req.body.Id,
        LastName:data.req.body.LastName,
        Newsletter:data.req.body.Newsletter,
        FacebookID:data.req.body.Id,
        SavedBusiness:data.req.body.SavedBusiness,
        EmailNotification:data.req.body.EmailNotification,
        PushNotification:data.req.body.PushNotification        

      },    function(err,ant){
        if(err)
        {
          console.log(err);
          cb(null,err);
        }
          

         ant.accessTokens.create({
          //.AccessToken.create({
            created : new Date(),  
           // userId:ant[0].id
          },function(err,newToken){
            if(err)
            {
              console.log('err in newToken');
              cb(null,err);
            }
            else
            {

              console.log(newToken);
              ant.accessToken=newToken.id;
              cb(null,ant);
            }
          });

      });

    }
        else
        {

         ant[0].accessTokens.create({
          //.AccessToken.create({
            created : new Date(),  
           // userId:ant[0].id
          },function(err,newToken){
            if(err)
            {
              console.log('err in newToken');
              cb(null,err);
            }
            else
            {
              ant[0].accessToken=newToken.id;
              console.log(newToken);
              cb(null,ant[0]);
            }
          });
       }

});

else
Account.find({where:{"GoogleID":data.req.body.Id}},function(err,ant){
          if(err)
            cb(null,err);
          if(ant[0]==undefined)
          {
              //console.log(data.req.body.Id);
                  Account.create({
        FirstName:data.req.body.FirstName,
        email:data.req.body.email,
        password: data.req.body.Id,
        LastName:data.req.body.LastName,
        Newsletter:data.req.body.Newsletter,
        GoogleID:data.req.body.Id,
        SavedBusiness:data.req.body.SavedBusiness,
        EmailNotification:data.req.body.EmailNotification,
        PushNotification:data.req.body.PushNotification        

      },    function(err,ant){
        if(err)
        {
          console.log(err);
          cb(null,err);
        }
          

         ant.accessTokens.create({
          //.AccessToken.create({
            created : new Date(),  
           // userId:ant[0].id
          },function(err,newToken){
            if(err)
            {
              console.log('err in newToken');
              cb(null,err);
            }
            else
            {

              console.log(newToken);
              ant.accessToken=newToken.id;
              cb(null,ant);
            }
          });

      });

    }

        else
        {

         ant[0].accessTokens.create({
          //.AccessToken.create({
            created : new Date(),  
           // userId:ant[0].id
          },function(err,newToken){
            if(err)
            {
              console.log('err in newToken');
              cb(null,err);
            }
            else
            {
              ant[0].accessToken=newToken.id;
              cb(null,ant[0]);
            }
          });
         }
});

 // cb(null,res);
};

*/
//Social Signin

Account.socialsignin = function(data,cb)
{ 
  if(data.req.body.email==null)
    cb(null,"Email Field is empty");

Account.find({where:{"email":data.req.body.email}},function(err,ant){
          if(err)
            cb(null,err);
          if(ant[0]==undefined)
          {
              //console.log(data.req.body.Id);
                  Account.create({
        FirstName:data.req.body.FirstName,
        email:data.req.body.email,
        password: data.req.body.Id,
        LastName:data.req.body.LastName,
        Newsletter:data.req.body.Newsletter,
        //FacebookID:data.req.body.Id,
        SavedBusiness:data.req.body.SavedBusiness,
        EmailNotification:data.req.body.EmailNotification,
        PushNotification:data.req.body.PushNotification        

      },    function(err,ant){
        if(err)
        {
          console.log(err);
          cb(null,err);
        }
        
        if(data.req.body.Type=='FB')  
        ant.FacebookID=data.req.body.Id;
        else
        ant.GoogleID=data.req.body.Id;
        ant.save();
         ant.accessTokens.create({
          //.AccessToken.create({
            created : new Date(),  
           // userId:ant[0].id
          },function(err,newToken){
            if(err)
            {
              console.log('err in newToken');
              cb(null,err);
            }
            else
            {

              console.log(newToken);
              ant.accessToken=newToken.id;
              cb(null,ant);
            }
          });

      });

    }
        else
        {
        if(ant[0].FacebookID==null&&data.req.body.Type=='FB')
        {
          ant[0].FacebookID=data.req.body.Id;
          ant[0].save();
        }
        if(ant[0].GoogleID==null&&data.req.body.Type=='Google')
        {
         ant[0].GoogleID=data.req.body.Id;
         ant[0].save(); 
        }

         ant[0].accessTokens.create({
          //.AccessToken.create({
            created : new Date(),  
           // userId:ant[0].id
          },function(err,newToken){
            if(err)
            {
              console.log('err in newToken');
              cb(null,err);
            }
            else
            {
              ant[0].accessToken=newToken.id;
              console.log(newToken);
              cb(null,ant[0]);
            }
          });
       }

});

 // cb(null,res);
};



// Adding social Token


Account.addtoken=function(data,cb)
{

            Account.find({where:{"id":data.req.body.Id}},function(err,ant){
              if(err)
                cb(null,err);
              else
              {
                if(data.req.body.type=='FB')
                  ant[0].accessTokenFacebook=data.req.body.token;
                else
                  ant[0].accessTokenGoogle=data.req.body.token;

                ant[0].save();
                cb(null,'Sucessfully Updated');
              }
            });
};


 Account.addaccount = function (ctx,options,cb) {
      
     
        if(!options) options = {};
        ctx.req.params.container = 'profilepic';

 Account.app.models.container.upload(ctx.req,ctx.result,options,function (err,fileObj) {
           //console.log(fileObj);
            if(err) {
                cb(err);
            } 
            if(fileObj.files.hasOwnProperty('file')) 
            {
          var fileInfo = fileObj.files.file[0];
      if(fileObj.fields.hasOwnProperty('FirstName'))
      var FirstName= fileObj.fields.FirstName[0];
      if(fileObj.fields.hasOwnProperty('LastName'))
      var LastName = fileObj.fields.LastName[0];
      if(fileObj.fields.hasOwnProperty('email'))
      var email = fileObj.fields.email[0];
      if(fileObj.fields.hasOwnProperty('password'))
      var password = fileObj.fields.password[0];
        if(fileObj.fields.hasOwnProperty('Newsletter'))
      var Newsletter = fileObj.fields.Newsletter[0];
        if(fileObj.fields.hasOwnProperty('FacebookID'))
      var FacebookID =fileObj.fields.FacebookID[0];
        if(fileObj.fields.hasOwnProperty('GoogleID'))
      var GoogleID = fileObj.fields.GoogleID[0];      
        if(fileObj.fields.hasOwnProperty('SavedBusiness'))
      var SavedBusiness = fileObj.fields.SavedBusiness[0];  
        if(fileObj.fields.hasOwnProperty('EmailNotification'))
      var EmailNotification = fileObj.fields.EmailNotification[0];  
        if(fileObj.fields.hasOwnProperty('PushNotification'))
      var PushNotification = fileObj.fields.PushNotification[0];  



      Account.create({
        FirstName:FirstName,
        email:email,
        password:password,
        UserPicture:CONTAINERS_URL+fileInfo.container+'/download/'+fileInfo.name,
        LastName:LastName,
        Newsletter:Newsletter,
        FacebookID:FacebookID,
        GoogleID:GoogleID,
        SavedBusiness:SavedBusiness,
        EmailNotification:EmailNotification,
        PushNotification:PushNotification        

      },    function(err,ant){
        if(err)
          cb(null,err);
        //console.log(fileInfo);
        var extensionType= fileInfo.type.split('/');
        console.log(extensionType);
        var fileCurrentPath= './server/storage/profilepic'+'/'+fileInfo.name;
        newFilePath='./server/storage/profilepic'+'/'+ant.id+'.'+extensionType[1];

        fs.rename(fileCurrentPath, newFilePath, function (err) {
            if (err) throw err;
            //console.log('renamed complete');
            });

        ant.UserPicture=CONTAINERS_URL+fileInfo.container+'/download/'+ant.id+'.'+extensionType[1];
        ant.save();
         Account.login({email: email , password: password }, function (err, token) {
           console.log(token);
           ant.accessToken= token.id;
          // ant.container='profilepic';
          // ant.UserPicture= ''+ant.id+'.'+extensionType[1];
            cb(null,ant);
         });


      });
    }
    else
      {
      if(fileObj.fields.hasOwnProperty('FirstName'))
      var FirstName= fileObj.fields.FirstName[0];
      if(fileObj.fields.hasOwnProperty('LastName'))
      var LastName = fileObj.fields.LastName[0];
      if(fileObj.fields.hasOwnProperty('email'))
      var email = fileObj.fields.email[0];
      if(fileObj.fields.hasOwnProperty('password'))
      var password = fileObj.fields.password[0];
        if(fileObj.fields.hasOwnProperty('Newsletter'))
      var Newsletter = fileObj.fields.Newsletter[0];
        if(fileObj.fields.hasOwnProperty('FacebookID'))
      var FacebookID =fileObj.fields.FacebookID[0];
        if(fileObj.fields.hasOwnProperty('GoogleID'))
      var GoogleID = fileObj.fields.GoogleID[0];      
        if(fileObj.fields.hasOwnProperty('SavedBusiness'))
      var SavedBusiness = fileObj.fields.SavedBusiness[0];  
        if(fileObj.fields.hasOwnProperty('EmailNotification'))
      var EmailNotification = fileObj.fields.EmailNotification[0];  
        if(fileObj.fields.hasOwnProperty('PushNotification'))
      var PushNotification = fileObj.fields.PushNotification[0];  

      Account.create({
        FirstName:FirstName,
        email:email,
        password:password,
        LastName:LastName,
        Newsletter:Newsletter,
        FacebookID:FacebookID,
        GoogleID:GoogleID,
        SavedBusiness:SavedBusiness,
        EmailNotification:EmailNotification,
        PushNotification:PushNotification        

      },    function(err,ant){
        if(err)
          cb(null,err);
         Account.login({email: email , password: password }, function (err, token) {

           console.log(token);
           ant.accessToken= token.id;
            cb(null,ant);
         });


      });

      }

  });
};


 Account.editaccount = function (ctx,options,cb) {
        if(!options) options = {};
        ctx.req.params.container = 'profilepic';

      Account.app.models.container.upload(ctx.req,ctx.result,options,function (err,fileObj) {
            if(!fileObj.fields.hasOwnProperty('Id'))
              cb(err);
            else
              var Id= fileObj.fields.Id[0];
            if(err) {
                cb(err);
            } 
            if(fileObj.files.hasOwnProperty('file')) 
            {
          var fileInfo = fileObj.files.file[0];

            var extensionType= fileInfo.type.split('/');
        //console.log(extensionType);
      

           var fileCurrentPath= './server/storage/profilepic'+'/'+fileInfo.name;
            newFilePath='./server/storage/profilepic'+'/'+Id+'.'+extensionType[1];

            fs.rename(fileCurrentPath, newFilePath, function (err) {
            if (err) throw err;
            //console.log('renamed complete');
            });

            Account.find({where:{"id":Id}},function(err,ant){
                if(err)
               cb(null,err);
                else
                {
        if(fileObj.fields.hasOwnProperty('FirstName'))
        ant[0].FirstName=fileObj.fields.FirstName[0];
        if(fileObj.fields.hasOwnProperty('LastName'))
        ant[0].LastName=fileObj.fields.LastName[0];
        if(fileObj.fields.hasOwnProperty('Newsletter'))      
        ant[0].Newsletter=fileObj.fields.Newsletter[0];
        if(fileObj.fields.hasOwnProperty('FacebookID'))
        ant[0].FacebookID=fileObj.fields.FacebookID[0];
        if(fileObj.fields.hasOwnProperty('GoogleID'))
        ant[0].GoogleID=fileObj.fields.GoogleID[0];
        if(fileObj.fields.hasOwnProperty('SavedBusiness'))
        ant[0].SavedBusiness=fileObj.fields.SavedBusiness[0];
        if(fileObj.fields.hasOwnProperty('EmailNotification'))
        ant[0].EmailNotification=fileObj.fields.EmailNotification[0];
        if(fileObj.fields.hasOwnProperty('PushNotification'))
        ant[0].PushNotification=fileObj.fields.PushNotification[0];
        ant[0].UserPicture = CONTAINERS_URL+fileInfo.container+'/download/'+ant[0].id+'.'+extensionType[1];      
        ant[0].save();
        //ant[0].container="profilepic";
        //ant[0].UserPicture= ''+ant[0].id+'.'+extensionType[1]; 
        cb(null,ant[0]);
                  }
                });
    }
    else
      {
             

            Account.find({where:{"id":Id}},function(err,ant){
                if(err)
               cb(null,err);
                else
                {
        if(fileObj.fields.hasOwnProperty('FirstName'))
        ant[0].FirstName=fileObj.fields.FirstName[0];
        if(fileObj.fields.hasOwnProperty('LastName'))
        ant[0].LastName=fileObj.fields.LastName[0];
        if(fileObj.fields.hasOwnProperty('Newsletter'))      
        ant[0].Newsletter=fileObj.fields.Newsletter[0];
        if(fileObj.fields.hasOwnProperty('FacebookID'))
        ant[0].FacebookID=fileObj.fields.FacebookID[0];
        if(fileObj.fields.hasOwnProperty('GoogleID'))
        ant[0].GoogleID=fileObj.fields.GoogleID[0];
        if(fileObj.fields.hasOwnProperty('SavedBusiness'))
        ant[0].SavedBusiness=fileObj.fields.SavedBusiness[0];
        if(fileObj.fields.hasOwnProperty('EmailNotification'))
        ant[0].EmailNotification=fileObj.fields.EmailNotification[0];
        if(fileObj.fields.hasOwnProperty('PushNotification'))
        ant[0].PushNotification=fileObj.fields.PushNotification[0];    
        ant[0].save(); 
        cb(null,ant[0]);
                }

                });

      }

  });
};



 Account.remoteMethod(
        'addaccount',
        {
            description: 'Uploads a file',
            accepts: [
                { arg: 'ctx', type: 'object', http: { source:'context' } },
                { arg: 'options', type: 'object', http:{ source: 'query'} }
            ],
            returns: {
                arg: 'fileObject', type: 'object', root: true
            },
            http: {verb: 'post'}
        }
    );


 Account.remoteMethod(
        'editaccount',
        {
            description: 'Uploads a file',
            accepts: [
                { arg: 'ctx', type: 'object', http: { source:'context' } },
                { arg: 'options', type: 'object', http:{ source: 'query'} }
            ],
            returns: {
                arg: 'fileObject', type: 'object', root: true
            },
            http: {verb: 'post'}
        }
    );

Account.remoteMethod(
        'addtoken',
        {
          description: 'Adds a Token',
          accepts:
              { arg: 'data', type: 'object', http: { source: 'context' } } ,
          returns:{
            arg: 'message', type: 'string'
          },
          http: {verb: 'post'}
        }
  );



Account.remoteMethod(
        'socialsignin',
        {
          description: 'Sign in with Google or facebook . credentials: a Json with Type(FB,Google),Id(facebook or google), email, FirstName,LastName',
          accepts:{ arg: 'data', type: 'object', http: { source: 'context' } },
              
          returns:{
            arg: 'fileObject', type: 'object', root: true
          },

          http: {verb: 'post'}
        });



};
