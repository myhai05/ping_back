const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const userValidation = require('../controllers/userValidation');
const resetPassword = require('../controllers/resetPassword');



router.post("/register", userController.signUp);
router.get('/verify-email', userValidation.verifyEmail);
router.post('/request-reset-password', resetPassword.requestResetPassword);
router.post('/login', userController.signIn);
router.get('/logout', userController.logout);
router.get("/", userController.getAllUsers);
router.delete("/:id", userController.userDelete);
router.put("/:id", userController.userUpdate);
router.get("/:id", userController.userInfo);

module.exports = router;