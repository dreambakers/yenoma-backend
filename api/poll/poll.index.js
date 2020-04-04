const express = require('express');
const controller = require('./poll.controller')
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

router
    .post('/', authenticate, controller.createPoll)
    .get('/all', authenticate, controller.getPolls)
    .get('/getPoll/:id', controller.getPoll)
    .get('/manage/:id', authenticate, controller.managePoll)
    .post('/update', authenticate, controller.updatePoll)
    .post('/delete/:id', authenticate, controller.deletePoll)
    .post('/terminate/:id', authenticate, controller.terminatePoll)
    .post('/restore/:id', authenticate, controller.restorePoll);

module.exports = router;