const express = require('express');
const router = express.Router();

const survey = require("../api/survey/survey.index");
const user = require("../api/user/user.index");
const response = require("../api/response/response.index");
const payment = require("../api/payment/payment.index");

router
    .use('/survey', survey)
    .use('/user', user)
    .use('/response', response)
    .use('/payment', payment)

module.exports = router;