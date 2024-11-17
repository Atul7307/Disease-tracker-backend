const { login, patientDataEntry, getAllPatients, deletePatient, getUserData, getPatientsByEmail} = require('../Controllers/AuthController');
const {signupValidation, loginValidation} = require('../Middlewares/AuthValidation');

const Signup = require('../Controllers/signupAuth');


// const { getAllPatients } = require("../Controllers/PatientController");

const express = require('express');
// const router = require('express').Router();

const router = express.Router();

router.post('/login',loginValidation, login);
// router.post('/signup',signupValidation, signup);
router.get('/getusers', getUserData)
router.post('/patiententry', patientDataEntry);
router.get("/getAllPatients", getAllPatients);
router.delete("/deleteOne/:adharNumber", deletePatient);

router.post('/signup', signupValidation, Signup);
router.get("/patientsByEmail/:email", getPatientsByEmail);

// patients


module.exports = router;
// module.exports = router;

router.post('/signup', (req, res) => {
    // Handle the request
    res.send('Login successful!');
});



// frontend code for get all gata...
// In your frontend file (e.g., React component)

// import React, { useState, useEffect } from "react";

// const PatientList = () => {
//     const [patients, setPatients] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Function to fetch patient data
//         const fetchPatients = async () => {
//             try {
//                 const response = await fetch("http://localhost:8080/auth/getAllPatients");
//                 const data = await response.json();
                
//                 if (data.success) {
//                     setPatients(data.data);  // Set patients to the fetched data
//                 }
//             } catch (error) {
//                 console.error("Error fetching patient data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPatients();
//     }, []);

//     if (loading) return <p>Loading...</p>;

//     return (
//         <div>
//             <h1>Patient List</h1>
//             <ul>
//                 {patients.map((patient) => (
//                     <li key={patient._id}>
//                         Name: {patient.name}, Age: {patient.age}, Symptoms: {patient.Symptoms}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default PatientList;
