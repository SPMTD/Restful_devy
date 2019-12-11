const mongoose = require('mongoose');

const {Schema} = mongoose;

const devyModel =  new Schema(
    {
        name: {type:String, default: null},
        band: {type:String, default: null},
        album: {type:String, default: null},
        genre: {type:String, default: null},
        heard: {type:Boolean, default: false}
    }
);

module.exports = mongoose.model('Devys', devyModel);