const express = require('express');
const controller = require('./response.controller')
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

router
    .post('/', controller.recordResponse)
    .post('/update', controller.updateResponse)
    .get('/getResponseForPoll/:pollId', authenticate, controller.getResponseForPoll)
    .get('/:responseId', authenticate, controller.getResponse)
    .delete('/:responseId', authenticate, controller.deleteResponse)

module.exports = router;