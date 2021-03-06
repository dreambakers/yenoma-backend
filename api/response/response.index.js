const express = require('express');
const controller = require('./response.controller')
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

router
    .post('/', controller.recordResponse)
    .post('/update', controller.updateResponse)
    .get('/getResponseForPoll/:pollId', authenticate, controller.getResponseForSurvey)
    .get('/:responseId', authenticate, controller.getResponse)
    .delete('/:responseId', authenticate, controller.deleteResponse)
    .get('/verify/:responseId', controller.verifyValidity)

module.exports = router;