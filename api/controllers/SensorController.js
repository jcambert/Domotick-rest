/**
 * SensorController
 *
 * @description :: Server-side logic for managing sensors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	status : function(req,res){
        var mqtt = PubSub.client();
        PubSub.on('switch',function(topic,message){
            sails.log('receive from pubsub:'+message.toString());
        })
        PubSub.send('switch','HELLO FROM REST SERVER');

        return res.ok();
    }
};

