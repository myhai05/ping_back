const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
require('dotenv').config();

module.exports.checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(req.cookies.jwt);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.error(err);
        res.locals.user = null;
        // Supprimer le cookie JWT invalide
        res.cookie('jwt', '', { maxAge: 1 });
        return res.status(401).json({ message: 'Invalid token' });
      } else {
        try {
          const user = await UserModel.findById(decodedToken.id);
          res.locals.user = user; // Stocker les informations utilisateur dans res.locals pour une utilisation ultérieure
          // Vérifier si l'utilisateur a le rôle administrateur
          if (user && user.role === 'admin') {
            res.locals.isAdmin = true;
            next();
          } else {
            res.locals.isAdmin = false;
            return res.status(403).json({ message: 'Access denied' });
          }
        } catch (error) {
          console.error(error);
          res.locals.user = null;
          return res.status(500).json({ message: 'Internal server error' });
        }
      }
    });
  } else {
    res.locals.user = null;
    return res.status(401).json({ message: 'No token provided' });
  }
};


module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
     
      if (err) {
        console.log(err);
        res.send(403).json({ message: 'Token invalid or expired' })
      } else {
       // console.log('Decoded Token ID:', decodedToken.id);
        req.user = decodedToken.id;  // Add the decoded token to the request object
        req.role = decodedToken.role;
        next();
      }
    });
  } else {
    console.log('No token');
  }
  /* 
    if (cookieHeader) {
      const token = cookieHeader.split(';').find(cookie => cookie.trim().startsWith('jwt='));
            
      if (token) {
        const tokenValue = token.split('=')[1].trim();
        console.log('voici le token '+tokenValue);
        jwt.verify(tokenValue, secretJwt, async (err, decodedToken) => {
          if (err) {
            console.error(err);
            res.status(401).json('Token invalide');
          } else {
            console.log(req.user);
            req.user = decodedToken; // Ajouter le token décodé à la requête pour une utilisation ultérieure
            next();
          }
        });
      } else {
        console.log("Aucun token JWT trouvé dans l'en-tête Cookie.");
        res.status(401).json('Token manquant');
      }
    } else {
      console.log("Aucun en-tête Cookie trouvé.");
      res.status(401).json('En-tête Cookie manquant');
    }*/
  };