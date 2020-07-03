const express = require('express');
const controller = require('./user.controller')
const router = express.Router();
const { authenticate } = require('../../middleware/authenticate');

router
    .post('/', controller.signUp)
    .post('/login', controller.login)
    .post('/logout', authenticate, controller.logout)
    .post('/changePassword', authenticate, controller.changePassword)
    .post('/refreshToken', authenticate, controller.refreshToken)
    .post('/refreshToken', authenticate, controller.refreshToken)
    .get('/getProfile', authenticate, controller.getProfile)
    .post('/updateProfile', authenticate, controller.updateProfile)
    .post('/verifySignup', controller.verifySignup)
    .post('/sendSignupVerificationEmail', controller.sendSignupVerificationEmail)
    .post('/requestPasswordResetEmail', controller.sendPasswordResetEmail)
    .post('/verifyPasswordResetToken', controller.verifyPasswordResetToken)
    .post('/resetPassword', controller.resetPassword);

module.exports = router;