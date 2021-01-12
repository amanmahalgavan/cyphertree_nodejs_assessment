const models = require('../models');
const {user: User} = models;


const checkDuplicateEmail = (req, res, next) => {
  // Check if Email already exists
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      return res.status(400).json({message: "Failed! Email is already in use!"});
    }

    next();
  }).catch(err => {
      return res.status(500).json({message: err});
  });
};

const checkIfEmailIsValid = (req, res, next) => {
    const {email} = req.body;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(String(email).toLowerCase())){
        return res.status(400).json({message: 'Please provide a valid Email Address.'});
    }
    next()
}


const verifyUserRegistration = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkIfEmailIsValid: checkIfEmailIsValid
};

module.exports = verifyUserRegistration;