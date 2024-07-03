const UserModel = require('../models/user.model');

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      const user = await UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() } // Ensure token has not expired
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      user.password = newPassword; // Ensure you hash the password before saving
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };