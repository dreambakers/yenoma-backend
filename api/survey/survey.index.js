const express = require('express');
const controller = require('./survey.controller')
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

router
    .post('/', authenticate, controller.createSurvey)
    .get('/all', authenticate, controller.getSurveys)
    .post('/getSurvey/:id', controller.getSurvey)
    .get('/manage/:id', authenticate, controller.manageSurvey)
    .post('/update', authenticate, controller.updateSurvey)
    .post('/delete/:id', authenticate, controller.deleteSurvey)
    .post('/terminate/:id', authenticate, controller.terminateSurvey)
    .post('/restore/:id', authenticate, controller.restoreSurvey)
    .post('/duplicate/:id', authenticate, controller.duplicateSurvey);

module.exports = router;