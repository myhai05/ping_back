const nodemailer = require('nodemailer');
require('dotenv').config();


const createMailTransporter= () =>{

 const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

module.exports = {createMailTransporter }; 
  