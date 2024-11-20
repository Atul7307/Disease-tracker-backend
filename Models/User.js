const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        // lowercase: true   
    },
    password: {
        type: String,
        require: true,
        // minlength: 4,
        // maxlength: 12     
    },
    hospitalLevel:{
        type: String,  // Hostpital levels :  PHC level CHC level DH level
        required: true,
        trim : true,
        enum: ['PHC', 'CHC', 'DH'],
    },
    pincode: {
        type: String, // Added pincode field for better integration
        trim: true,
    },
    address: {
        block: {
            type: String,
            trim: true,
        },
        district: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
    },

});




const PatientSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    adharNumber: {
        type: String, // Changed to String to allow flexibility (e.g., formatted numbers)
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String, // Changed to String to accommodate country codes
        required: true,
        trim: true,
    },
    symptoms: {
        type: String,
        required: true,
        trim: true,
    },
    consultant: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    pincode: {
        type: String, // Added pincode field for better integration
        trim: true,
    },
    address: {
        block: {
            type: String,
            trim: true,
        },
        district: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});



// Patient Recover Data Model
const RecoveryPatientSchema = new Schema({
    name: String,
    adharNumber: String,
    age: Number,
    phoneNumber: String,
    symptoms: String,
    consultant: String,
    email: String,
    pincode: String,
    address: {
        block: String,
        district: String,
        state: String,
    },
    deletedAt: {
        type: Date,
        default: Date.now,
    },
    originalCreatedAt: Date,
});

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
const PatientModel = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
const RecoveryPatientModel = mongoose.models.RecoveryPatient || mongoose.model('RecoveryPatient', RecoveryPatientSchema);


module.exports = {
    UserModel,
    PatientModel,
    RecoveryPatientModel
}