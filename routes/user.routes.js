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

router.post('/post/add-post', upload.single('video'), videoController.createVideo);
router.get('/post/get-posts', videoController.getVideos);
router.get('/post/get-video', videoController.getVideosByPostAndUser);
router.put('/:id',  videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);

router.post('/post/save-chapters', videoController.saveChapters);
router.get('/post/chapters/:videoId', videoController.getChapters);


module.exports = router;