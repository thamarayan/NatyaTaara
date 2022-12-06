var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var registerSchema = new Schema({
    user:{type: Schema.Types.ObjectId, ref:'User'},
    studentName:{type:String, required:true},
    studentAge:{type:Number, required:true},
    contact:{type:String, required:true},
    address:{type:String, required:true},
    course:{type:Object, required:true},
    feesPending:{type:Number,default:0},
    feesStatus:{type:Boolean, default:0},
    studentStatus:{type:Boolean, default:1},
});

module.exports = mongoose.model('Register', registerSchema);