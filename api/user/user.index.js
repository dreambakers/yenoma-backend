const express = require('express');
const controller = require('./user.controller')
const router = express.Router();
const { authenticate } = require('../../middleware/authenticate');

router
    .post('/', controller.signUp)
    .post('/login', controller.login)
    .post('/logout', authenticate, controller.logout)

module.exports = router;