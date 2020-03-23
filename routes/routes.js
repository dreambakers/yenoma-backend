const express = require('express');
const router = express.Router();

const poll = require("../api/poll/poll.index");
const user = require("../api/user/user.index");
const response = require("../api/response/response.index");

router
    .use('/poll', poll)
    .use('/user', user)
    .use('/response', response)

module.exports = router;