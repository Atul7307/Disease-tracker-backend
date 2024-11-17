const bcrypt = require("bcrypt");
const User = require("../Models/signup");

const Signup = async (req, res) => {
  try {
    const { name, email, password, hospitalLevel, pincode, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      hospitalLevel,
      pincode,
      address: {
        block: address.block,
        district: address.district,
        state: address.state,
      },
    });

    await user.save();
    res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
  } catch (error) {
    res.status(500).json({
      message: `Internal server error: ${error.message}`,
      success: false,
    });
  }
};

module.exports = Signup;
