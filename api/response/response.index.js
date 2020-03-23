const express = require('express');
const controller = require('./response.controller')
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

router
    .post('/', controller.recordResponse)
    .post('/update', controller.updateResponse)

module.exports = router;