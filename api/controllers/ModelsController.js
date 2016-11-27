/**
 * ModelsController
 *
 * @description :: Server-side logic for managing Models
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	get : function(req,res){
        //var temp=sails.models;
        var result={};
      
       _.forEach(sails.models,function(value,key){
           result[key]=value._attributes;
            
        });

       /*  var keys = _.keys(sails.models);
       _.forEach(keys,function(key){
           var o={};o[key]=sails.models[key]._attributes;
           sails.log.info(sails.models[key]);
           result.push(key);
       })*/
        res.send(200,result);
    }
};

