const strformat = require('strformat');
module.exports = {
    formatRequest:function(type,params){
        //request:'/:location/sensor/:id/:type/request',
        return  Domotick.formatReqRes(type,params,'request');//strformat(sails.config.domotick[type].request,params);
    },

    formatResponse:function(type,params){
        //request:'/:location/sensor/:id/:type/response',
        return Domotick.formatReqRes(type,params,'response');// strformat(sails.config.domotick[type].request,params);
    },

    formatReqRes:function(type,params,reqres){
        return strformat(sails.config.domotick[type][reqres],params);
    }
}