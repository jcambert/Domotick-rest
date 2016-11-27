
const Twitter = require('twitter-node-client').Twitter;
const Promise = require('Bluebird');

module.exports = function twitter(sails) {

    var self=this;
    this.instance=undefined;
    self.configKey='Twitter';
    
    

    function __request(func,params){
        var defer = Promise.defer();
        var ok = function(data){
            defer.resolve(data);
        };
        var bad = function(err, response, body){
             defer.reject(body);
        }

        if(params.url && func=='getCustomApiCall'){
            sails.log.info('Twitter Custom Api call:',params.url,':',func);
            var url=params.url;
            delete params.url;
            self.instance[func](url,params,bad,ok);
        }else{
            
            if(_.isFunction(self.instance[func])){
                sails.log.info('Twitter Standard Api call:',func,'with params:',params);
                self.instance[func](params,bad,ok );
            }else    
                defer.reject(func + ' is not a recognized function')
        }

        return defer.promise;
    }
    
    return {
        configure: function(){
            sails.log.info('Twitter Configure');
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
                    sails.log.info('Twitter instance');sails.log(options);
                     // Finish initializing custom hook
                // Then call cb()
                    return cb();
                });
            });
           
            
        },
        version:function(){return '0.1';},
        exposeEndPoint:function(){
            return{
                getUserTimeline:{
                    params:{
                        screen_name:'The screen name of the user for whom to return results for.',
                        user_id:'The ID of the user for whom to return results for.',
                        since_id:'Returns results with an ID greater than (that is, more recent than) the specified ID. There are limits to the number of Tweets which can be accessed through the API. If the limit of Tweets has occured since the since_id, the since_id will be forced to the oldest ID available.',
                        count:'optional	Specifies the number of Tweets to try and retrieve, up to a maximum of 200 per distinct request. The value of count is best thought of as a limit to the number of Tweets to return because suspended or deleted content is removed after the count has been applied. We include retweets in the count, even if include_rts is not supplied. It is recommended you always send include_rts=1 when using this API method.',
                        max_id:'Returns results with an ID less than (that is, older than) or equal to the specified ID.',
                        trim_user:'When set to either true , t or 1 , each Tweet returned in a timeline will include a user object including only the status authors numerical ID. Omit this parameter to receive the complete user object.',
                        exclude_replies:'This parameter will prevent replies from appearing in the returned timeline. Using exclude_replies with the count parameter will mean you will receive up-to count tweets — this is because the count parameter retrieves that many Tweets before filtering out retweets and replies. This parameter is only supported for JSON and XML responses.',
                        contributor_details:'This parameter enhances the contributors element of the status response to include the screen_name of the contributor. By default only the user_id of the contributor is included.',
                        include_rts	:'When set to false , the timeline will strip any native retweets (though they will still count toward both the maximal length of the timeline and the slice selected by the count parameter). Note: If you’re using the trim_user parameter in conjunction with include_rts, the retweets will still contain a full user object.'	
                    },
                    description:'Returns a collection of the most recent Tweets posted by the user indicated by the screen_name or user_id parameters.',
                    example:'getUserTimeline/?screen_name=twitterapi&count=2'
                },
                getMentionsTimeline:{
                    params:{
                        count:'Specifies the number of Tweets to try and retrieve, up to a maximum of 200. The value of count is best thought of as a limit to the number of tweets to return because suspended or deleted content is removed after the count has been applied. We include retweets in the count, even if include_rts is not supplied. It is recommended you always send include_rts=1 when using this API method.',
                        since_id:'Returns results with an ID greater than (that is, more recent than) the specified ID. There are limits to the number of Tweets which can be accessed through the API. If the limit of Tweets has occured since the since_id, the since_id will be forced to the oldest ID available.',
                        max_id:'Returns results with an ID less than (that is, older than) or equal to the specified ID.',
                        trim_user:'When set to either true , t or 1 , each tweet returned in a timeline will include a user object including only the status authors numerical ID. Omit this parameter to receive the complete user object',
                        include_entities:'The entities node will not be included when set to false.'
                    },
                    description:'Returns the 20 most recent mentions (Tweets containing a users’s @screen_name) for the authenticating user.\nThe timeline returned is the equivalent of the one seen when you view your mentions on twitter.com.\nThis method can only return up to 800 tweets.',
                    example:'getMentionsTimeline/?count=2&since_id=14927799'
                }
            }
        },
        request : function(name,params){
            return __request(name,params);
        },
     /*    getUserTimeline :function(params){
            return __request('getUserTimeline',params)
        },

        getMentionsTimeline : function(params){
            return __request('getMentionsTimeline',params);
        },
        getHomeTimeline: function(params){
            return __request('getHomeTimeline',params);
        },

        getFavorites : function (params) {
            return __request('getFavorites',params);
        },*/

       


   };





};