const express = require('express');
const router = express.Router();

const survey = require("../api/survey/survey.index");
const user = require("../api/user/user.index");
const response = require("../api/response/response.index");

router
    .use('/survey', survey)
    .use('/user', user)
    .use('/response', response)

module.exports = router;