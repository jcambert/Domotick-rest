//var YQL = require('yql');

const Promise = require('Bluebird');
const strformat = require('strformat');
const extend = require('extend');
module.exports = function yahooweather(sails){
    this.instance=undefined;
    var self=this;
    self.configKey='YahooWeather';
    this.apis={byCityId:'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\'{id}\') and u=\'{units}\''};
    //this.appid="&appid={appid}";

    function YahooWeather(options){
        if (!(this instanceof YahooWeather)) { return new OpenWeatherMap(YahooWeather) }
        this.options = _.extend({},options);
        sails.log('YahooWeather instance');sails.log(this.options);
        this.version = sails.config[self.configKey].version;
    }

    YahooWeather.prototype.__request=function(options){
        var url = this.formatUrl(options);
        sails.log('YahooWeather: try to request : '+url);
        return SourceRequest.exec(url);
    }
    YahooWeather.prototype.formatUrl = function(options){
        var reqopt=_.extend({},this.options, options);
        var query=self.apis[options.query];//encodeURIComponent(self.apis[options.query]);
        var url = sails.config[self.configKey].base+query;//+this.appid;
        url=strformat(url,reqopt);
        return url;
    }
    return{
        configure: function(){
            sails.log('YahooWeather configure');
            sails.config[self.configKey]={};
            sails.config[self.configKey].version = '0.1',
            sails.config[self.configKey].base='http://query.yahooapis.com/v1/public/yql?format=json&q=';
            //https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='chicago, il')&format=json
        },
        initialize:function(cb){
            sails.log('YahooWeather initialize');
           
            self.instance = new YahooWeather({units:'c'});  
                    
            // Finish initializing custom hook
            // Then call cb()
            return cb();
              
           
            
        },
        exposeEndPoint:function(){
            return{

                byCityId:{
                    params:{
                        id:'City ID',
                        units:'Units either c(elcius),f(arenheit)'
                    },
                    description:'You can call by city ID. API responds with exact result.\n We recommend to call API by city ID to get unambiguous result for your city.',
                    example:'weather/getById?id=delle'
                },

            }
        },
        version:function(){return self.instance.version;},
        byCityId:function(params){
            if(!params.query)params.query='byCityId';
            return self.instance.__request(params);
        },
    };
}