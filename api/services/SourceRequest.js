
var request = require('request');
const Promise = require('Bluebird');
module.exports = {
    exec:function(url){
        var defer = Promise.defer();
        var sended = false;
        request.get({url: url}, function(error, response, body) {
            if(sended)return;
            sended=true;
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
            if(sended)return;
            sended=true;
            defer.reject(504,'The end point did not respond');
        }, sails.config.source.timeout); 

        return defer.promise;
    },

}