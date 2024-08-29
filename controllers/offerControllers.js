const OfferModel = require('../models/offer.model');

module.exports.addOffer = async (req, res) => {
    const { title, description, price, validityMonths } = req.body;
    try {
        const newOffer = new OfferModel({ title, description, price, validityMonths });
        await newOffer.save();
        res.status(200).json(newOffer);
    } catch (error) {
        res.status(500).json({ message: 'Error creating offer' });
    }
};
// Get all offers
module.exports.getOffers = async (req, res) => {
   try {
        const offers = await OfferModel.find().select('title description price');
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching offers' });
    }
};
// Update an offer
module.exports.updateOffer = async (req, res) => {
    const { title, description, price } = req.body;
    
    try {
        const updatedOffer = await OfferModel.findByIdAndUpdate(req.params.id, { title, description, price }, { new: true });
        res.status(200).json(updatedOffer);
    } catch (error) {
        res.status(500).json({ message: 'Error updating offer' });
    }
};
// Delete an offer
module.exports.deleteOffer = async (req, res) => {
    try {
        await OfferModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Offer deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting offer' });
    }
};