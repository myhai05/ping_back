const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { sendValidationEmail } = require('../utils/sendVerificationMail');
const fs = require('fs');

const maxAge = 60 * 60 * 1000;
const jwtSecret = process.env.JWT_SECRET;

const createToken = (id, role) => {
  return jwt.sign({ id, role }, jwtSecret, {
    expiresIn: `${maxAge}s`
  })
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);//apelle de la fonction login
    const token = createToken(user._id, user.role);//création d'un token avec l'id et la clé secrèt
    res.cookie('jwt', token, {
      httpOnly: true, maxAge, secure: true, 
      sameSite: 'None'
    });
    const responseData = {
      userId: user._id,
      role: user.role,
    };
    res.status(200).json({ responseData }); // Retourner un message de succès avec le token   
  } catch (err) {
    res.status(401).json(err);
  }
}


module.exports.signUp = async (req, res) => {
  const { email, password, firstName, lastName } = req.body

  try {
    let userRegistred = await UserModel.findOne({ email });
    if (userRegistred) return res.status(400).json("Le mel est déjà utilisé");
    const user = await UserModel.create({ email, password, firstName, lastName });
    await sendValidationEmail(user, req, res);
  }
  catch (err) {
    res.status(500).send({ err });
    console.log(err);
  }
}

module.exports.userDelete = async (req, res) => {

  try {
    await UserModel.deleteOne({ _id: req.params.id }).exec(); // Utiliser deleteOne() au lieu de remove()
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.userUpdate = async (req, res) => {
  const _id = req.params.id; // Get the user ID from the request parameters
  const { email, firstName, lastName } = req.body; // Get the user data from the request body

  try {
    // Find the user by ID in the database
    let user = await UserModel.findById(_id);

    // Update user information only if provided
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (req.file) {
      user.picture = `uploads/profil/${req.file.filename}`;// Check if a profile picture file was uploaded
    }
    // Save the updated user information to the database
    await user.save();

    // Send a success response
    res.status(200).json({ message: "Informations de l'utilisateur mises à jour avec succès"});
  } catch (err) {
    // Handle errors and send a 500 response
    res.status(500).json({ error: err.message });
  }
};

module.exports.userInfo = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("-password");
    if (user) { res.json(user);} 
  } catch (err) {
    console.log("User not found ", err);
    res.status(500).send("Internal server error");
  }
};


module.exports.logout = (req, res) => {
  res.cookie('jwt', '', { minAge: 1, httpOnly: true });
  res.redirect('/login');
}


module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};


module.exports.userCredits = async (req, res) => {
  const { userId, credits } = req.body;
  try {
    await UserModel.findByIdAndUpdate(userId, { credits });
    res.status(200).json({ message: 'Credits deducted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deducting credits', error });
  }
};

