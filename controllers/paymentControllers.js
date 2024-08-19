const { response } = require('express');
const stripe = require('../config/stripe');
const Payment = require('../models/payment.model');
const UserModel = require('../models/user.model');
require('dotenv').config();


exports.checkoutSession = async (req, res) => {
  const { amount, userId } = req.body;
  console.log(req.body);
    console.log(userId);
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Votre Produit',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONEND_CORS_URL}/private`,
      cancel_url: `${process.env.FRONEND_CORS_URL}/cancel`,
      //customer: user.stripeCustomerId, // Attach the Stripe customer ID
      metadata: {
        userId: userId, // Attach the userId in the metadata
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Erreur lors de la création de la session Checkout:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de la session Checkout' });
  }
};



// Créer un PaymentIntent
exports.createPaymentIntent = async (req, res) => {

  const { amount, userId, offerId } = req.body;
  console.log(req);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      metadata: { userId, offerId }
    });
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Webhook pour gérer les événements Stripe
exports.handleWebhook = async (req, res) => {
    
  endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'invoice.paid':
      const invoice = event.data.object;
      await handleInvoicePaid(invoice);
      break;
    // Ajoutez ici d'autres types d'événements que vous souhaitez gérer
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};

const handleInvoicePaid = async (invoice) => {

  const userId = invoice.metadata.userId; //'668e92de0146958c235495b9'; // Récupérer l'ID de l'utilisateur depuis les métadonnées
  const amount = invoice.amount_paid/100; // Montant payé

  const payment = new Payment({
    userId: userId,
    //subscriptionId: subscriptionId,
    amount: amount,
    status: 'paid',
    //invoiceId: invoice.id,
    date: new Date(invoice.created * 1000) // Convertir le timestamp Unix en date JS
  });

try {
  await payment.save();
  console.log('Payment saved successfully');

  const user = await UserModel.findById(userId);

  if (user) {
    user.credits += 5; // Ajouter 5 crédits à l'utilisateur
    await user.save();
    console.log(`User ${userId} credited with 5 credits`);
  } else {
    console.log(`User with id ${userId} not found`);
  }

} catch (err) {
  console.error('Error saving payment:', err);
  throw err;
}

}

// Récupérer tous les paiements
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).populate('offerId', 'title price');
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};