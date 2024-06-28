const UserModel = require('../models/user.model');
const crypto = require('crypto');
const sendEmail = require('../utils/sendResetEmail');

exports.requestResetPassword = async (req, res) => {
  const { email } = req.body;
           
  try {
    const user = await UserModel.findOne({ email });
      
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 heure

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    const emailText = `Click here to reset your password: ${resetURL}`;
    await sendEmail(user.email, 'Password Reset Request', emailText);

    res.status(200).json({ message: 'Password reset link sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
