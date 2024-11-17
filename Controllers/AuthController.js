// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { UserModel, PatientModel } = require("../Models/User");
const user = require("../Models/signup");



const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usercheck = await user.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!usercheck) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, usercheck.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: usercheck.email, _id: usercheck._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: usercheck.name
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


// Fectching user Data 
const getUserData = async (req, res) => {
    try {
        const usercheck = await user.find({}); 

        res.status(200).json({
            success: true,
            data: usercheck
        });
    } catch (err) {
        console.error("Error fetching patients:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch patient data"
        });
    }
}


// Patient Data Filling 
// const patientDataEntry = async (req, res) => {
//     try {
//         const { name, adharNumber, address, age, phoneNumber, symptoms, consultant, email, pincode } = req.body;

//         // Validation: Check Aadhar Number length
//         if (adharNumber.length !== 12 || isNaN(adharNumber)) {
//             return res.status(400).json({ message: 'Please provide a valid 12-digit Aadhar Number.', success: false });
//         }

//         // Validation: Check Phone Number length
//         if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
//             return res.status(400).json({ message: 'Please provide a valid 10-digit Phone Number.', success: false });
//         }

//         // Check if the user already exists by Aadhar Number
//         const existingUser = await PatientModel.findOne({ adharNumber });
//         if (existingUser) {
//             return res.status(409).json({ message: 'User with this Aadhar Number already exists.', success: false });
//         }

//         // Create and save new patient data with all address fields (district, state, block)
//         const newPatient = new PatientModel({
//             name,
//             adharNumber,
//             address: {
//                 block: address.block, // from the frontend
//                 district: address.district, // from the frontend
//                 state: address.state, // from the frontend
//             },
//             age,
//             phoneNumber,
//             symptoms,
//             consultant,
//             email,
//             pincode, // added pincode
//         });

//         await newPatient.save();

//         return res.status(201).json({
//             message: 'Patient data entry successful.',
//             success: true,
//         });
//     } catch (err) {
//         console.error('Error occurred while saving patient data:', err);

//         return res.status(500).json({
//             message: 'Internal server error.',
//             success: false,
//         });
//     }
// };


const patientDataEntry = async (req, res) => {
    try {
        const { name, adharNumber, address, age, phoneNumber, symptoms, consultant, email } = req.body;

        // Validation for Aadhar and Phone numbers
        if (adharNumber.length !== 12) {
            return res.status(400).json({ message: 'Invalid Aadhar number', success: false });
        }

        if (phoneNumber.length !== 10) {
            return res.status(400).json({ message: 'Invalid phone number', success: false });
        }

        // Check if the user already exists
        const userExists = await PatientModel.findOne({ adharNumber });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists', success: false });
        }

        // Create and save the new patient record
        const newPatient = new PatientModel({
            name,
            adharNumber,
            address,
            age,
            phoneNumber,
            symptoms,
            consultant,
            email,
            createdAt: new Date(),
        });

        await newPatient.save();
        res.status(201).json({
            message: 'Patient data entry successful',
            success: true,
        });

        // Schedule deletion after 1 minute
        setTimeout(async () => {
            try {
                await PatientModel.deleteOne({ _id: newPatient._id });
                console.log(`Patient record with ID ${newPatient._id} deleted after 1 minute.`);
            } catch (err) {
                console.error('Error deleting patient record:', err);
            }
        }, 15*60*60000); 
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};

module.exports = { patientDataEntry };


// delete a patient by adharNumber
const deletePatient = async (req, res) => {
  const adharNumber = req.params.adharNumber; // Get the adharNumber from the URL parameter

  try {
    // Find the patient by adharNumber and delete the record
    const patient = await PatientModel.findOneAndDelete({ adharNumber });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Respond with a success message if the patient is deleted
    res.status(200).json({ 
        message: "Patient deleted successfully" ,
        deletedData: patient
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Automatic delete data


// Fetch all patient data
const getAllPatients = async (req, res) => {
    try {
        const patients = await PatientModel.find({}); 

        res.status(200).json({
            success: true,
            data: patients
        });
    } catch (err) {
        console.error("Error fetching patients:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch patient data"
        });
    }
};

// fetch data by email
const getPatientsByEmail = async (req, res) => {
    try {
        const { email } = req.params; // Get email from URL parameters

        // Find patients by email
        const patients = await PatientModel.find({ email });

        if (!patients.length) {
            return res.status(404).json({
                success: false,
                message: "No patients found for the given email",
            });
        }

        res.status(200).json({
            success: true,
            data: patients,
        });
    } catch (err) {
        console.error("Error fetching patients by email:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};



module.exports = {
    // signup,
    login,
    patientDataEntry,
    getAllPatients,
    deletePatient,
    getUserData,
    getPatientsByEmail
}