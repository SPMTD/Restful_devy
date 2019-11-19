const mongoose = require('mongoose');

const {Schema} = mongoose;

const devyModel =  new Schema(
    {
        name: {type:String},
        band: {type:String},
        album: {type:String},
        genre: {type:String},
        heard: {type:Boolean, default: false}
    }
);

module.exports = mongoose.model('Devys', devyModel);