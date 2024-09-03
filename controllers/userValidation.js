const UserModel = require('../models/user.model');



module.exports.verifyEmail = async (req, res) => {
    
    const token = req.query.token;

    try {
      const user = await UserModel.findOne({ emailToken: token });
  
      user.isVerified = true;
      user.emailToken = null;
      await user.save();
  
      res.status(200).send('Email has been successfully verified.');
      
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

 