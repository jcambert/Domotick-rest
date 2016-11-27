

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
        sails.log('OpenWeatherMap instance');sails.log(this.options);
        this.version = sails.config[self.configKey].version;
        this.apis={byCityName:'?q=city',  byCityId:'?q={id}&lang={lang}&units={units}',byLatLon:'?lat={lat}&lon={lon}&lang={lang}&units={units}',byZip:'?zip={zip}&lang={lang}&units={units}'};
        this.appid="&appid={appid}"
           
    }
    OpenWeatherMap.prototype.__request = function(options){
        var url = this.formatUrl(options);
        sails.log('OpenWeatherMap: try to request : '+url);
        return SourceRequest.exec(url);

    }

    OpenWeatherMap.prototype.formatUrl = function(options){
         var reqopt=_.extend({},this.options, options);
        sails.log('OpenWeatherMap Request');sails.log(this.options);sails.log(reqopt);

        var url = sails.config[self.configKey].base+options.type+this.apis[options.query]+this.appid;
        url=strformat(url,reqopt);
        return url;
    }

    

    return{
        configure: function(){
            sails.log('OpenWeatherMap configure');
            sails.config[self.configKey]={};
            sails.config[self.configKey].version = '0.1',
            sails.config[self.configKey].base='http://api.openweathermap.org/data/2.5/';

        },

        initialize:function(cb){
            sails.log('OpenWeatherMap initialize');
            sails.on('hook:orm:loaded', function() {
                 Source.findOne({name:'OpenWeatherMap'}).exec(function(err,record){
                     //sails.log(record);
                    if(err || record==undefined){
                        sails.log.warn('Try to instantiate OpenWeatherMap without credential');
                        sails.log.warn('Set credential on each request');
                    }
                    if(sails.config.environment == 'development' && (record==undefined || !record.keys)){
                        record={keys:{appid:'d288da12b207992dd796241cf56014b1'}};
                    }
                    var options= _.extend({},{units:'metric',lang:'fr'},(record==undefined?{}:record.keys))  ;
                    self.instance = new OpenWeatherMap(options);  
                    
                     // Finish initializing custom hook
                // Then call cb()
                    return cb();
                });
            });
           
            
        },
        version:function(){return self.instance.version;},
        exposeEndPoint:function(){
            return{
                byCityName:{
                    params:{
                        q:'City name and country code divided by comma, use ISO 3166 country codes'
                    },
                    description:'You can call by city name or city name and country code. API responds with a list of results that match a searching word.',
                    example:'weather/byCityName?q=London,uk'
                },
                byCityId:{
                    params:{
                        id:'City ID'
                    },
                    description:'You can call by city ID. API responds with exact result.\n We recommend to call API by city ID to get unambiguous result for your city.',
                    example:'weather/getById?id=delle'
                },
                byLatLon:{  
                    params:{
                        lat:'Latitud of city',
                        lon:'Longitud of city'
                    },
                    description:'Get Weather by geographic coordinates',
                    example:'weather/byLatLon?lat=35&lon=139'
                },
                byZip:{  
                    params:{
                        zip:'Zip of city could by zip,counrtry'
                    },
                    description:'Get Weather by zip code',
                    example:'weather/?zip=94040,us'
                }
            }
        },

        byCityName:function(params){
            if(!params.query)params.query='byCityName';
            return self.instance.__request(params);
        },
        byCityId:function(params){
            if(!params.query)params.query='byCityId';
            return self.instance.__request(params);
        },
        byLatLon:function(params){
            if(!params.query)params.query='byLatLon';
            return self.instance.__request(params);
        },
        byZip:function(params){
            if(!params.query)params.query='byZip';
            return self.instance.__request(params);
        }
    }
}