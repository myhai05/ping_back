const UserModel = require('../models/user.model');
const crypto = require('crypto');
const sendEmail = require('../utils/sendResetEmail');
require('dotenv').config();


exports.requestResetPassword = async (req, res) => {
  const { email } = req.body;
           
  try {
    const user = await UserModel.findOne({ email });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    await user.save();

    const resetURL = `${req.protocol}://${process.env.FRONT_URL}/reset-form/${resetToken}`;
    
    const emailText = `Click here to reset your password: ${resetURL}`;
    await sendEmail(user.email, 'Password Reset Request', emailText);

    res.status(200).json({ message: 'Password reset link sent' });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
