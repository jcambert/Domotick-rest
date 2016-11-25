const google = require('googleapis');
module.exports = function google(sails){
    this.instance=undefined;
    var self=this;
    self.configKey='Google';

    function Google(options){
        if (!(this instanceof Google)) { return new Google(options) }
        this.options = _.extend({},options);
        sails.log('Google instance');sails.log(this.options);
        this.version = sails.config[self.configKey].version;
    }
    return{
        configure: function(){
            sails.log('Google Api configure');
            sails.config[self.configKey]={};
            sails.config[self.configKey].version = '0.1',
            sails.config[self.configKey].base='http://api.openweathermap.org/data/2.5/';

        },
         initialize:function(cb){
            sails.log('Google Api initialize');
            sails.on('hook:orm:loaded', function() {
                 Source.findOne({type:'Google'}).exec(function(err,record){
                    if(err || record==undefined){
                        sails.log.warn('Try to instantiate Google without credential');
                        sails.log.warn('Set credential on each request');
                    }
                    if(sails.config.environment == 'development' && record==undefined){
                       // record={keys:{appid:'d288da12b207992dd796241cf56014b1'}};
                    }
                    self.instance = new Google({});  
                    
                     // Finish initializing custom hook
                // Then call cb()
                    return cb();
                });
            });
           
            
        },
    }
} 