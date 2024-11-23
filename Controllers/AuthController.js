// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { UserModel, PatientModel, RecoveryPatientModel } = require("../Models/User");
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


// const patientDataEntry = async (req, res) => {
//     try {
//         const { name, adharNumber, address, age, phoneNumber, symptoms, consultant, email } = req.body;

//         // Validation for Aadhar and Phone numbers
//         if (adharNumber.length !== 12) {
//             return res.status(400).json({ message: 'Invalid Aadhar number', success: false });
//         }

//         if (phoneNumber.length !== 10) {
//             return res.status(400).json({ message: 'Invalid phone number', success: false });
//         }

//         // Check if the user already exists
//         const userExists = await PatientModel.findOne({ adharNumber });
//         if (userExists) {
//             return res.status(409).json({ message: 'User already exists', success: false });
//         }

//         // Create and save the new patient record
//         const newPatient = new PatientModel({
//             name,
//             adharNumber,
//             address,
//             age,
//             phoneNumber,
//             symptoms,
//             consultant,
//             email,
//             createdAt: new Date(),
//         });

//         await newPatient.save();
//         res.status(201).json({
//             message: 'Patient data entry successful',
//             success: true,
//         });

//         // Schedule deletion after 1 minute
//         setTimeout(async () => {
//             try {
//                 const patient = await PatientModel.findOne({ _id: newPatient._id });
        
//                 if (patient) {
//                     // Save the patient record to RecoveryPatientModel
//                     const recoveryData = new RecoveryPatientModel({
//                         ...patient.toObject(),
//                         deletedAt: new Date(),
//                     });
//                     await recoveryData.save();
        
//                     // Delete from PatientModel
//                     await PatientModel.deleteOne({ _id: newPatient._id });
//                     console.log(`Patient record with ID ${newPatient._id} moved to recovery after 15 days.`);
//                 }
//             } catch (err) {
//                 console.error("Error during automatic patient deletion:", err);
//             }
//         }, 15 * 24 * 60 * 60 * 1000); // 15 days
        
//     } catch (err) {
//         console.error('Error:', err);
//         res.status(500).json({
//             message: 'Internal server error',
//             success: false,
//         });
//     }
// };


const cron = require('node-cron');

// Patient data entry function
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
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};

// Schedule job to move data after 15 days
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Running daily job to check for expired patient data...');
        
        const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
        
        // Find records older than 15 days
        const expiredPatients = await PatientModel.find({ createdAt: { $lte: fifteenDaysAgo } });

        for (const patient of expiredPatients) {
            // Save to RecoveryPatientModel
            await RecoveryPatientModel.create({
                ...patient.toObject(),
                deletedAt: new Date(),
            });

            // Delete from PatientModel
            await PatientModel.deleteOne({ _id: patient._id });
            console.log(`Patient record with ID ${patient._id} moved to recovery.`);
        }
    } catch (err) {
        console.error('Error during scheduled data move:', err);
    }
});

module.exports = { patientDataEntry };



// delete a patient by adharNumber
const deletePatient = async (req, res) => {
    const adharNumber = req.params.adharNumber;

    try {
        // Find the patient by Aadhar Number
        const patient = await PatientModel.findOne({ adharNumber });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Save the deleted patient data to RecoveryPatientModel
        const recoveryData = new RecoveryPatientModel({
            ...patient.toObject(), 
            deletedAt: new Date(),
        });
        await recoveryData.save();

        // Delete the patient record from PatientModel
        await PatientModel.deleteOne({ adharNumber });

        res.status(200).json({
            message: "Patient deleted successfully and saved to recovery data.",
            deletedData: recoveryData,
        });
    } catch (error) {
        console.error("Error while deleting patient:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




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


// Patient Recovery Controller
const getRecoveryPatients = async (req, res) => {
    try {
        const recoveryPatients = await RecoveryPatientModel.find({});
        res.status(200).json({
            success: true,
            data: recoveryPatients,
        });
    } catch (error) {
        console.error("Error fetching recovery patients:", error);
        res.status(500).json({ success: false, message: "Failed to fetch recovery patient data" });
    }
};

module.exports = { getRecoveryPatients };





module.exports = {
    // signup,
    login,
    patientDataEntry,
    getAllPatients,
    deletePatient,
    getUserData,
    getPatientsByEmail,
    patientDataEntry,
    getRecoveryPatients
}