require('dotenv').config();
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { sendValidationEmail } = require('../utils/sendVerificationMail');
const ObjectID = require('mongoose').Types.ObjectId;
const path = require('path');
const fs = require('fs');




const maxAge = 60 * 60 * 1000;
const minAge = 1;
const jwtSecret = process.env.JWT_SECRET;

const createToken = (id, role) => {
  return jwt.sign({ id, role }, jwtSecret, {
    expiresIn: `${maxAge}s`
  })
};


module.exports.signUp = async (req, res) => {
  const {  email, password, firstName, lastName } = req.body

  try {
    let userRegistred = await UserModel.findOne({ email });
    if(userRegistred) return res.status(400).json("Le mel est déjà utilisé");

    const user = await UserModel.create({ email, password, firstName, lastName });
   await sendValidationEmail(user, req, res);
  }
  catch (err) {
    res.status(200).send({ err });
    console.log(err);
  }
}

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
       
  try {
    const user = await UserModel.login(email, password);
    
    const token = createToken(user._id,user.role);//création d'un token avec l'id et la clé secrète


    res.cookie('jwt', token, { httpOnly: true, maxAge, secure: true, // use secure cookies in production
      sameSite: 'None' });
    const responseData = {
      userId: user._id,
      role: user.role,
      //email: user.email,
      //picture: user.picture,
      //firstName: user.firstName,
      //lastName: user.lastName,
     // contacts: user.contacts.map(contact => ({
      //  contactId: contact._id,
     //   contactName: contact.contactName,
     //   contactPrenom: contact.contactPrenom,
     //   contactTel: contact.contactTel
     // })),
      // Include any other fields you want to return
    };
    res.status(200).json({ responseData }); // Retourner un message de succès avec le token   
  } catch (err) {
    res.status(401).json(err);
  }
}

module.exports.logout = (req, res) => {
  
  res.cookie('jwt', '', { minAge: 1, httpOnly: true });

  res.redirect('/login');

}


module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};


// Fonction pour supprimer un utilisateur
module.exports.userDelete = async (req, res) => {

  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.deleteOne({ _id: req.params.id }).exec(); // Utiliser deleteOne() au lieu de remove()
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};


module.exports.userUpdate = async (req, res) => {
   console.log(req.body);
   console.log(req.file);
  const _id = req.params.id; // Get the user ID from the request parameters
  const { email, firstName, lastName } = req.body; // Get the user data from the request body

  try {
    // Find the user by ID in the database
    let user = await UserModel.findById(_id);

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Update user information only if provided
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    // Check if a profile picture file was uploaded
    if (req.file) {
      // If a previous profile picture exists, remove it
      if (user.picture && user.picture !== `uploads/profil/${req.file.filename}`) {
        fs.unlinkSync(path.join(__dirname, '..', user.picture));
      }

      // Save the new profile picture path
      user.picture = `uploads/profil/${req.file.filename}`;
    }

    // Save the updated user information to the database
    await user.save();

    // Send a success response
    res.status(200).json({ message: "Informations de l'utilisateur mises à jour avec succès", user });
  } catch (err) {
    // Handle errors and send a 500 response
    res.status(500).json({ error: err.message });
  }
};


module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  UserModel.findById(req.params.id)
    .select("-password")
    .then(docs => {
      if (!docs) {
        return res.status(404).send("User not found");
      }
      res.send(docs);
    })
    .catch(err => {
      console.log("Error finding user: ", err);
      res.status(500).send("Internal server error");
    });
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

