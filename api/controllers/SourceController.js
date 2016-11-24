/**
 * SourceController
 *
 * @description :: Server-side logic for managing sources
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');
const Promise = require('Bluebird');
const strformat = require('strformat');

module.exports = {
	request:function(req,res){

        var defer = Promise.defer();
        Source.findOne({id:req.params.id}).exec(function(err,record){
          
            if(err || record == undefined)
                defer.reject(res.send(404,"Source id:"+req.params.id+ " not found"));
            else{
                var params = _.extend({},req.params);
                params.apikey =record.apikey || '';

                var url = strformat(record.url,params);
                sails.log('Source request URL:'+url);
                

                request.get({url: url}, function(error, response, body) {
                        if (error) {
                            sails.log.error(error);
                            defer.reject(res.send(404,error));
                        }
                        else {
                            sails.log.info(response);
                            sails.log.info(body);
                            defer.resolve(res.send(body));
                        }
                
                });
            }
        });
        return defer.promise;
        
    },

    twitter:function(req,res){
        res.send(200,sails.hooks.twitter.sayHi('ambert'));
    }
};

