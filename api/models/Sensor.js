/**
 * Sensor.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //Name of the sensor, Required and must be unique
    name:{
      type:'string',
      required:true,
      unique:true
    },

    //Description of the sensor
    description:{
      type:'string'
    },

    //Location of the sensor,
    //Not required but util for scenarii
    location:{
      model:'location'
    },

    //type of sensor
    type:{
     model:'SensorType',
     required:true
    },

    //if sensor type is http
    url:{
      type:'string'
    },

    // User credential if
    userCredential:{
      type:'string'
    },

    passwordCredential:{
      type:'string'
    }

  }
};

