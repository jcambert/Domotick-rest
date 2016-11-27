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
    request : function(req,res){
        //try{
            sails.log.info('SourceController Request');
            var ok = function(result){
                return res.send(200,result);
            }

            var bad = function(err){
                return res.send(400,err);
            }
            //params.query source/type/query
            sails.log.info(req.params);//sails.log(sails.hooks[req.params.source]);
            //if(1==1)return res.ok();

           /* if(req.params.source == 'twitter')
                return Twitter.authenticate({consumer_key:'T2FXYnUqgqLbNPfJJfga60ja7',consumer_secret:'PVNR0cqbPmPN17ZD41NKuiCYEyNWe25hdJQrBTPUPj41lh0LRb'},function(e,data){
                    sails.log.info(e);
                    sails.log.info(data);
                    return res.ok();
                });
            else*/
            if(req.params.type && !req.params.query)
                req.params.query=req.params.type;
            else{
                req.query.type=req.params.type;
                delete req.params.type;
            }

            if(req.params.type == 'version')
                return res.send(200,sails.hooks[req.params.source].version());
            else{
                var src = sails.hooks[req.params.source];
                var fnc = undefined;
                if(src[req.params.query] && _.isFunction(src[req.params.query])){
                    fnc=src[req.params.query];
                    fnc( req.query).then(ok,bad);
                }else if( _.isFunction(src.request)){
                    fnc = src.request;
                    fnc(req.params.query, req.query).then(ok,bad);
                } else{
                    bad({});
                }
                
                    
            }
     /*   }catch(err){
            res.send(400,err);
        }*/
    },

    exposed :function(req,res){

         
         if(req.params.source && sails.hooks[req.params.source] && _.isFunction(sails.hooks[req.params.source].exposeEndPoint))
            return res.json(sails.hooks[req.params.source].exposeEndPoint());

        var result=[];
        _.forEach(sails.hooks,function(o){
            if(_.isFunction(o.exposeEndPoint)){
                var oo={};oo[o.identity]=o.exposeEndPoint();
                result.push(oo);
            }
        });
       
       
        return res.json(result);
    },
    version : function(req,res){
        sails.log.info('Get version of OpenWeatherMap',req.params);
        sails.log.info(sails.hooks[req.params.source]);
        return res.send(200,sails.hooks[req.params.source].version());
    } 
  /*  twitterkeys:function(req,res){
        Source.findOne({id:1}).exec(function(err,record){
            record.keys={consumer_key:'T2FXYnUqgqLbNPfJJfga60ja7',consumer_secret:'PVNR0cqbPmPN17ZD41NKuiCYEyNWe25hdJQrBTPUPj41lh0LRb',token:'	563143978-EwMa2YbZQkh5juNAnNXZr78wX2rXF9guSZcnWgAw',token_secret:'	oKCGCYAVbegjY9tZHXRm6UsxCS80Pf7M1oUq3SpJTVSAS'};
            record.save();
            return res.ok();
        })
    }*/
};

