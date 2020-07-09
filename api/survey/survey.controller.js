const { Survey } = require('./survey.model');
const { Response } = require('../response/response.model');

const createSurvey = async ({ user, body }, res) => {
    try {
        let survey = body.poll;

        const newPoll = new Survey({...survey, createdBy: user._id });
        survey = await newPoll.save();

        res.json({
            success: 1,
            poll: survey
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while creating the poll'
        });
    }
}

const getSurvey = async (req, res) => {
    try {
        const surveyId = req.params.id;
        const survey = await Survey.findOne({ shortId: surveyId }).populate('createdBy');
        if (survey) {
            if (survey.password) {
                if (!req.body.password) {
                    return res.json({
                        poll: {},
                        success: 0,
                        passwordRequired: true
                    });
                } else if (req.body.password !== survey.password) {
                    return res.json({
                        success: 0,
                        incorrectPassword: true
                    });
                }
            }
            return res.json({
                success: 1,
                poll: survey
            });
        }
        throw { msg: `No survey found against: ${req.params.id}` };
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while getting the poll'
        });
    }
}

const manageSurvey = async (req, res) => {
    try {
        const results = await Promise.all([
            Survey.findOne({ _id: req.params.id, createdBy: req.user._id }).populate('createdBy'),
            Response.find({for: req.params.id})
        ]);

        res.json({
            success: !!results[0],
            poll: results[0],
            responses: results[1]
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while getting the poll'
        });
    }
}

const getSurveys = async ({ user }, res) => {
    try {
        let surveys = await Survey.find({ createdBy: user._id, status: { $in: ['open', 'terminated']} }).lean();
        res.json({
            success: 1,
            polls: surveys
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while getting the surveys'
        });
    }
}

const updateSurvey = async ({ body: { poll }, user }, res) => {
    try {
        const result = await Survey.updateOne({ _id: poll._id, createdBy: user._id, status: { $in: ['open', 'terminated']} }, poll);
        res.json({
            success: result.nModified !== 0,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while updating the survey'
        });
    }
}

const deleteSurvey = async (req, res) => {
    try {
        await Survey.updateOne({ _id: req.params.id, createdBy: req.user._id }, {status: 'deleted'});
        res.json({
            success: 1,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while deleting the survey'
        });
    }
}

const terminateSurvey = async (req, res) => {
    try {
        const updatedSurvey = await Survey.findOneAndUpdate({
            _id: req.params.id,
            createdBy: req.user._id
        }, {
            status: 'terminated',
            terminatedAt: Date.now()
        }, {
            new: true
        });
        res.json({
            success: !!updatedSurvey,
            poll: updatedSurvey
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while terminating the survey'
        });
    }
}

const restoreSurvey = async (req, res) => {
    try {
        const updatedSurvey = await Survey.findOneAndUpdate({
            _id: req.params.id,
            createdBy: req.user._id
        }, {
            status: 'open',
            $unset: { terminatedAt: 1 }
        }, {
            new: true
        });
        res.json({
            success: !!updatedSurvey,
            poll: updatedSurvey
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while restoring the survey'
        });
    }
}

const duplicateSurvey = async (req, res) => {
    try {
        let survey = await Survey.findOne({ _id: req.params.id, createdBy: req.user._id }).lean();
        if (survey) {
            delete survey['_id'];
            delete survey['shortId'];
            delete survey['createdAt'];
            delete survey['updatedAt'];
            delete survey['responses'];
            survey.isNew = true;

            const newPoll = new Survey(survey);
            survey = (await newPoll.save()).toObject();

            res.json({
                success: !!survey,
                poll: survey
            });
        } else {
            throw { msg: `No survey found against survey id ${req.params.id}, createdBy: ${req.user._id}` };
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while duplicating the survey'
        });
    }
}

module.exports = {
    createSurvey, getSurveys, getSurvey, updateSurvey, deleteSurvey, terminateSurvey, restoreSurvey, manageSurvey, duplicateSurvey
};