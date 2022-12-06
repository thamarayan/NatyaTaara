var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath:{type:String},
    title:{type:String, required:true},
    desc:{type:String},
    date:{type:Date, required:true},
    time:{type:String,required:true},
    type:{type:String, required:true},
    venue:{type:String, default:'NA'},
    zoomID:{type:String, default:'NA'},
    fees:{type:Number, required:true},
    status:{type:Boolean, default:1}
});

module.exports = mongoose.model('Workshop', schema);