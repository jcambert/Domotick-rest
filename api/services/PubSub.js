
var mqtt=require('mqtt');
const url = require('url');

// api/services/PubSub.js
module.exports = {
    client:function(){
        var client=sails.config.pubsub.client;
       
        if(client == undefined){
            client = mqtt.connect(url.parse(sails.config.pubsub.server));
            client.on('connect',onConnect);
            client.on('close',onClose);

            if(sails.config.environment == 'development'){
                client.on('message',function(topic,message){
                    sails.log('Topc:'+topic.toString());
                    sails.log('Message:'+message.toString());
                })
            }

            sails.config.pubsub.client=client;
        }
        function onConnect() {
            sails.log('Connected to Mqtt Server:'+sails.config.pubsub.server);
        }

        function onClose(){
            sails.log('Connection lost from Mqtt Server:'+sails.config.pubsub.server);
        }

        
        return client;
    },

    send:function(topic,message,options,callback){
        PubSub.client().publish(topic,message,options,callback);
    },
    subscribe:function(topic){
        PubSub.client().subscribe(topic);
    },
    on:function(topic,callback){
        
        PubSub.client().on('message',function(topic,message){
            callback(topic,message);
        })
    }
};

