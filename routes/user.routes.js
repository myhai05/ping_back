const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const userValidation = require('../controllers/userValidation');
const requestPassword = require('../controllers/requestNewPassword');
const resetPassword = require('../controllers/resetPassword');
const offerController = require('../controllers/offerControllers');
const auth = require('../middlewares/authAdmin');
const videoController = require('../controllers/videoControllers');
const upload = require('../middlewares/upload');
const paymentController = require('../controllers/paymentControllers');
const bodyParser = require('body-parser');



router.post("/register", userController.signUp);
router.get('/verify-email', userValidation.verifyEmail);
router.post('/request-reset-password', requestPassword.requestResetPassword);
router.post('/reset-password/:token', resetPassword.resetPassword); // Updated route handler
router.post('/login', userController.signIn);
router.get('/logout', userController.logout);
router.get("/get-users", userController.getAllUsers);
router.delete("/:id", userController.userDelete);
router.put("/:id", userController.userUpdate);
router.get("/:id", userController.userInfo);
router.post('/deduct-credit', userController.userCredits);

router.post('/offers/add-offer', offerController.addOffer);
router.get('/offers/get-offers', offerController.getOffers);

/*router.put('/:id', updateOffer);
router.delete('/:id', deleteOffer);*/

router.post('/post/add-post', upload.single('video'), videoController.createVideo);
router.get('/post/get-posts', videoController.getVideos);
router.get('/post/get-video', videoController.getVideosByPostAndUser);
router.get('/post/get-all-posts', videoController.getAllVideos);
router.put('/:id',  videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);
router.post('/post/send-notification', videoController.sendNotification);
router.get('/post/get-notifications', videoController.getNotificatedUsers)

router.post('/post/save-chapters', videoController.saveChapters);
router.get('/post/chapters/:videoId', videoController.getChapters);
router.put('/post/mark-as-processed', videoController.markAsProcesed);

// Routes paiement
router.post('/payment/create-checkout-session', paymentController.checkoutSession);
router.post('/payment/create-payment-intent', paymentController.createPaymentIntent);
router.post('/payment/webhook', express.raw({type: 'application/json'}), paymentController.handleWebhook);
router.get('/payment/get-payments', paymentController.getAllPayments);



module.exports = router;