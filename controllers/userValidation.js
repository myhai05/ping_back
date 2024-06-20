const UserModel = require('../models/user.model');



module.exports.verifyEmail = async (req, res) => {
    
    const token = req.query.token;

    try {
      const user = await UserModel.findOne({ emailToken: token });
  
      if (!user) {
        return res.status(400).send({ message: 'Invalid token or token has expired.' });
      }

      // Vérifier si le token a expiré
      if (user.emailTokenExpires < Date.now()) {
        return res.status(400).send('Token has expired. Please request a new one.');
      }
  
      user.isVerified = true;
      user.emailToken = null;
      user.emailTokenExpires = null;
      await user.save();
  
      res.status(200).send('Email has been successfully verified.');
      
    } catch (err) {
        console.error('Error verifying email:', err);
      res.status(500).send({ message: err.message });
    }
  };

 