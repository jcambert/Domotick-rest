var request = require('request');
var Twitter = require('twitter-node-client').Twitter;
module.exports = function twitter(sails) {

    var self=this;
    this.instance=undefined;
    self.configKey='Twitter';
    
    
    return {
        configure: function(){
            sails.config[self.configKey]={};
            sails.config[self.configKey].version = '0.1'


        },
        initialize:function(cb){
            sails.log('Twitter initialize');
            sails.on('hook:orm:loaded', function() {
                 Source.findOne({name:'Twitter'}).exec(function(err,record){
                     //sails.log(record);
                    if(err || record==undefined){
                        sails.log.warn('Try to instantiate Twitter without credential');
                        sails.log.warn('Set credential on each request');
                    }
                   /* if(sails.config.environment == 'development' && (record==undefined || !record.keys)){
                        record={keys:{appid:'d288da12b207992dd796241cf56014b1'}};
                    }*/
                    var options= _.extend({},{units:'metric'},(record==undefined?{}:record.keys))  ;
                    self.instance = new Twitter(options);  
                    
                     // Finish initializing custom hook
                // Then call cb()
                    return cb();
                });
            });
           
            
        },
        version:function(){return self.instance.version;},
        /*routes:{
            after:{
                'GET /source/twitter':function(req,res,next){
                    //sails.log(Sensor);
                   Source.findOne({id:req.params.id || '1'}).exec(function(err,record){
                        sails.log(record);
                    })
                    res.send(200,'Hello from Twitter Hook');
                }
            }
        },*/
        // This function will be public
        get: function (path, params, callback) {
            return this.instance.get()
        },
        post: function(path, params, callback){

        },
        stream: function(path, params, callback){

        }


   };





};