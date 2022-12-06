var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    workshop:{type:Schema.Types.ObjectId, ref:'Workshop'},
    name:{type:String, required:true},
    contact:{type:String, required:true},
    email:{type:String, required:true},
    feesStatus:{type:Boolean,default:0}
});

module.exports = mongoose.model('wRegister', schema);