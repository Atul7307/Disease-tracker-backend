const { login, patientDataEntry, getAllPatients, deletePatient, getUserData, getPatientsByEmail, getRecoveryPatients} = require('../Controllers/AuthController');
const {signupValidation, loginValidation} = require('../Middlewares/AuthValidation');

const Signup = require('../Controllers/signupAuth');



const express = require('express');

const router = express.Router();

router.post('/login',loginValidation, login);
router.get('/getusers', getUserData)
router.post('/patiententry', patientDataEntry);
router.get("/getAllPatients", getAllPatients);
router.delete("/deleteOne/:adharNumber", deletePatient);
router.post('/signup', signupValidation, Signup);
router.get("/patientsByEmail/:email", getPatientsByEmail);
router.get('/recoverypatients', getRecoveryPatients);



module.exports = router;
