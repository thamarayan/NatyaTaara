var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath : {type:String, required:true},
    title:{type:String, required:true},
    description:{type:String},
    ageGroup:{type:String, required:true},
    level:{type:String, required:true},
    session1:{type:String, required:true},
    timing1:{type:String, required:true},
    session2:{type:String},
    timing2:{type:String},
    fees:{type:Number, required:true},
    classType:{type:String, required:true},
    onDemand:{type:Boolean, default:0},
    status:{type:Boolean, default:1}
});

module.exports = mongoose.model('Class', schema);