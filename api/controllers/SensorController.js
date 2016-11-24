/**
 * SensorController
 *
 * @description :: Server-side logic for managing sensors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const Promise = require('Bluebird');
module.exports = {
	request : function(req,res,next){
        var defer = Promise.defer();
        //sails.log(req.params);
        if(!req.params.id || !req.params.type){
            Sensor.findOne({id:req.params.id}).populate('location').populate('type').exec(function(err,record){
                if(err)defer.reject(res.send(404));
                sails.log(record);
                req.params.location = record.location.name;
                req.params.type = record.type.name;
                cb();
            });
        }else
            cb();

        function cb(){
            var request = Domotick.formatRequest('sensor',req.params);sails.log(request);
            var response = Domotick.formatResponse('sensor',req.params);sails.log(response);
            var sended=false;
            PubSub.on(response,function(topic,message){
            if(sended)return;
                sails.log('receive from pubsub:'+message);
                sended=true;
                defer.resolve(res.send(200,message));
                
            })
            PubSub.send(request);
            setTimeout(function() {
                if(sended)return;
                sended=true;
                defer.reject(res.send(408));
            }, sails.config.pubsub.timeout); 
            
        }
        return defer.promise;
        //return res.ok();
    },

};

