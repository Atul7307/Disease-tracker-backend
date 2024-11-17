const Joi = require('joi');

// const signupValidation = (req, res, next) => {
//     const schema = Joi.object({
//         name: Joi.string().min(3).max(100).required(),
//         email: Joi.string().email().required(),
//         password: Joi.string().min(4).max(100).required()
//     });
//     const { error } = schema.validate(req.body);
//     if(error) {
//         return res.status(400)
//         .json({message: "Bad Request", error})
//     }
//     next();
// }

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(4).max(100).required(),
      hospitalLevel: Joi.string()
        .valid("PHC", "CHC", "DH") // Add allowed values for hospitalLevel
        .required(),
      pincode: Joi.string()
        .length(6) // Ensure it is a 6-digit string
        .pattern(/^[0-9]+$/) // Only numeric values
        .required(),
      address: Joi.object({
        block: Joi.string().required(),
        district: Joi.string().required(),
        state: Joi.string().required(),
      }).required(),
    });
  
    const { error } = schema.validate(req.body, { abortEarly: false });
  
    if (error) {
      return res.status(400).json({ message: "Bad Request", error });
    }
    next();
  };

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const { error } = schema.validate(req.body);
    if(error) {
        return res.status(400)
        .json({message: "Bad Request", error})
    }
    next();
}

module.exports = {
    signupValidation,
    loginValidation
}