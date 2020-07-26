const express = require('express');
const controller = require('./payment.controller')
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

router
    .post('/capture', authenticate, controller.capturePayment)
    .get('/getSubscriptionPeriods', authenticate, controller.getSubscriptionPeriods);

module.exports = router;