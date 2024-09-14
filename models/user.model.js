const mongoose = require('mongoose');//on appele le module mongoose
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema(//on crée une bibliothéque mongoose dans laquelle on va déclarer le schèma utilisateur
  {
    email: { type: String, required: true, validate: [isEmail], lowercase: true, unique: true, trim: true,
    },
    password: { type: String, required: true, max: 1024, minlength: 6
    },
    picture: { type: String, default: "./uploads/profil/random-user.png" //le cheman pour 
    },
    firstName: { required: true, type: String, max: 1024, minlength: 3
    },
    lastName: { type: String, max: 1024,
    },
    emailToken: { type: String,
    },
    emailTokenExpires: { type: Date,
    },
    isVerified: { type: Boolean, default: false,
    },
    resetPasswordToken: { type: String,
    },
    resetPasswordExpires: { type: Date,
    },
    role: {
      type: String, enum: ['admin', 'user'], default: 'user',
    },
    credits: { type: Number, default: 0 
    }
  }, { timestamps: true },
);

const UserModel = mongoose.model('pingUser', userSchema);//user : c'est la table dans laquelle sera enregistré

module.exports = UserModel;