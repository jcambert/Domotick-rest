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
            sails.log.info(req.params);

            if(req.params.source == 'twitter')
                return Twitter.authenticate({consumer_key:'T2FXYnUqgqLbNPfJJfga60ja7',consumer_secret:'PVNR0cqbPmPN17ZD41NKuiCYEyNWe25hdJQrBTPUPj41lh0LRb'},function(e,data){
                    sails.log.info(e);
                    sails.log.info(data);
                    return res.ok();
                });
            else
            if(req.params.type == 'version')
                return res.send(200,sails.hooks[req.params.source].version());
            else
                sails.hooks[req.params.source][req.params.query](_.extend({lang:'fr'},req.params,req.query)).then(
                    function(result){
                        return res.send(200,result);
                    },
                    function(err){
                        return res.send(400,err);
                    });
     /*   }catch(err){
            res.send(400,err);
        }*/
    },

  /*  version : function(req,res){
        return res.send(200,sails.hooks[req.params.source].version);
    } */
    twitterkeys:function(req,res){
        Source.findOne({id:4}).exec(function(err,record){
            record.keys={consumer_key:'T2FXYnUqgqLbNPfJJfga60ja7',consumer_secret:'PVNR0cqbPmPN17ZD41NKuiCYEyNWe25hdJQrBTPUPj41lh0LRb',token:'	563143978-EwMa2YbZQkh5juNAnNXZr78wX2rXF9guSZcnWgAw',token_secret:'	oKCGCYAVbegjY9tZHXRm6UsxCS80Pf7M1oUq3SpJTVSAS'};
            record.save();
            return res.ok();
        })
    }
};

