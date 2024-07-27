// backend/config/stripe.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Assurez-vous que votre clé secrète Stripe est définie dans les variables d'environnement

module.exports = stripe;
