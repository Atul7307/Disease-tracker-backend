
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersignup = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    hospitalLevel:{type: String, required: true},
    pincode:{type: String , required: true},
    address:{
        block:{type: String , required: true},
        district:{type: String , required: true},
        state:{type: String , required: true},
    },
});

const User = mongoose.models.usersignup || mongoose.model("usersignup", usersignup);


module.exports = User;