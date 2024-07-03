const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const userValidation = require('../controllers/userValidation');
const requestPassword = require('../controllers/requestNewPassword');
const resetPassword = require('../controllers/resetPassword');
const offerController = require('../controllers/offerControllers');
const auth = require('../middlewares/authAdmin');



router.post("/register", userController.signUp);
router.get('/verify-email', userValidation.verifyEmail);
router.post('/request-reset-password', requestPassword.requestResetPassword);
router.post('/reset-password/:token', resetPassword.resetPassword); // Updated route handler
router.post('/login', userController.signIn);
router.get('/logout', userController.logout);
router.get("/", userController.getAllUsers);
router.delete("/:id", userController.userDelete);
router.put("/:id", userController.userUpdate);
router.get("/:id", userController.userInfo);

router.post('/offers/add-offer', auth.checkUser, offerController.addOffer);
router.get('/offers/get-offers', offerController.getOffers);

/*router.put('/:id', updateOffer);
router.delete('/:id', deleteOffer);*/


module.exports = router;