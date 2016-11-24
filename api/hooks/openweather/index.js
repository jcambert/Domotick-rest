

var request = require('request');
const Promise = require('Bluebird');
const strformat = require('strformat');
const extend = require('extend');

// File api/hooks/openweather/index.js
module.exports = function openweather(sails) {

    this.instance=undefined;
    var self=this;
    self.configKey='OpenWeatherMap';
    function OpenWeatherMap(options){
        if (!(this instanceof OpenWeatherMap)) { return new OpenWeatherMap(options) }
        this.options = _.extend({},options);
        sails.log('OpenWeatherMap instance');
        this.version = sails.config[self.configKey].version;
        this.apis={byCityId:'?q={id}',byLatLon:'?lat={lat}&lon={lon}&lang={lang}',byZip:'?zip={zip},{country}&lang={lang}'};
        this.appid="&appid={appid}"
           
    }
    OpenWeatherMap.prototype.__request = function(options){
        sails.log('OpenWeatherMap Request');sails.log(options);sails.log(extend(this.options, options));
        var defer = Promise.defer();

        var url = sails.config[self.configKey].base+options.type+this.apis[options.query]+this.appid;
        url=strformat(url,_.extend({},this.options, options));
        sails.log('OpenWeatherMap: try to request : '+url);
        request.get({url: url}, function(error, response, body) {
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
            defer.resolve(url);
        }, sails.config.pubsub.timeout); 

        return defer.promise;
    }
    return{
        configure: function(){
            sails.log('OpenWeatherMap configure');
            sails.config[self.configKey]={};
            sails.config[self.configKey].version = '0.1',
            sails.config[self.configKey].base='http://api.openweathermap.org/data/2.5/';

        },
        routes:{
            after:{
                'GET /source/openweather/:type/:query?':function(req,res,next){
                    sails.log(req.query);
                    try{
                        sails.hooks.openweather[req.params.query](_.extend({lang:'fr'},req.params,req.query)).then(
                                function(result){
                                    res.send(200,result);
                                },
                                function(err){
                                    res.send(400,err);
                                });
                    }catch(err){
                        res.send(400,err);
                    }

                },
                'GET /source/openweather/version':function(req,res,next){
                    sails.log.info('Request OpenWeatherMap:'+sails.hooks.openweather.version);
                    return res.send(200,sails.hooks.openweather.version);
                    
                }
            }
        },
        initialize:function(cb){
            sails.log('OpenWeatherMap initialize');
            sails.on('hook:orm:loaded', function() {
                 Source.findOne({type:'OpenWeatherMap'}).exec(function(err,record){
                    if(err || record==undefined){
                        sails.log.warn('Try to instantiate OpenWeatherMap without credential');
                        sails.log.warn('Set credential on each request');
                    }
                    
                    self.instance = new OpenWeatherMap(record==undefined?{}:record.keys);  
                    
                     // Finish initializing custom hook
                // Then call cb()
                    return cb();
                });
            });
           
            
        },
        version:function(){return self.instance.version;},
        byCityId:function(params){
            if(!params.query)params.query='byCityId';
            return self.instance.__request(params);
        },
        byLatLon:function(params){
            if(!params.query)params.query='byCityId';
            return self.instance.__request(params);
        },
        byZip:function(params){
            if(!params.query)params.query='byZip';
            return self.instance.__request(params);
        }
    }
}