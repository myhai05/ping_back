const nodemailer = require('nodemailer');
require('dotenv').config();
const { createMailTransporter } = require('../utils/createMailTransporter')



// Fonction pour envoyer un email
const sendResetEmail = async (to, subject, text) => {
  const transporter = createMailTransporter();
      
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to, // Use the `to` parameter passed to the function
        subject: subject || 'Reset password', // Allow dynamic subject
      text: text, // Use the `text` parameter passed to the function
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };


  
  module.exports = sendResetEmail;

