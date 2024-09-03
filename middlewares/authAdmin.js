const jwt = require('jsonwebtoken');
require('dotenv').config();



module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {

      if (err) {
        console.log(err);
        res.send(403).json({ message: 'Token invalid or expired' })
      } else {
        req.user = decodedToken.id;
        req.role = decodedToken.role;
        next();
      }
    });
  } else {
    console.log('No token');
  }
};