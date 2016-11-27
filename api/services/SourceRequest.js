
var request = require('request');
const Promise = require('Bluebird');
module.exports = {
    exec:function(url){
        var defer = Promise.defer();
        var sended = false;
        request.get({url: url}, function(error, response, body) {
            if(sended)return;
            sended=true;
            if (error) {
                //sails.log.error(error);
                defer.reject(res.send(404,error));
            }
            else {
                //sails.log.info(response);
                //sails.log.info(body);
                defer.resolve(body);
            }
        
        });
        setTimeout(function() {
            if(sended)return;
            sended=true;
            defer.reject(504,'The end point did not respond');
        }, sails.config.source.timeout); 

        return defer.promise;
    },
/*
    request:function(instance,func,params){
        if(instance == undefined){
            return res.send(500,'Backend instance not initialized. This may cause of malformed hook initialisation')
        }
        var sended=false;
        var defer = Promise.defer();
        
        var ok = function(data){
            if(sended)return;
            sended=true;
            defer.resolve(data);
        };

        var bad = function(err, response, body){
            if(sended)return;
            sended=true;
            defer.reject(body);
        }

        if(params.url && func=='getCustomApiCall'){
            sails.log.info('Custom Api call:',params.url,':',func);
            var url=params.url;
            delete params.url;
            instance[func](url,params,bad,ok);
        }else{
            
            if(_.isFunction(instance[func])){
                sails.log.info('Standard Api call:',func,'with params:',params);
                instance[func](params,bad,ok );
            }else{
                if(sended)return;
                sended=true;
                defer.reject(func + ' is not a recognized function')
            }
        }

         setTimeout(function() {
            if(sended)return;
            sended=true;
            defer.reject(504,'The end point did not respond');
        }, sails.config.source.timeout); 
        return defer.promise;
    }*/
}