/**
 * Source.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //name of the source, must be unique
    name:{
      type:'string',
      unique:true,
      required:true
    },
    
    //type of the source [weather, twitter, google, ...]
    type:{
      type:'string'
    },

    //Description of the source
    description:{
      type:'string'
    },

    //
    url:{
      type:'string'
    },

    apikey:{
      type:'string'
    },

    keys:{
      type:'json'
    }

  }
};

