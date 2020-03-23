const { Poll } = require('./poll.model');
const { Response } = require('../response/response.model');

const createPoll = async ({ user, body }, res) => {
    try {
        let poll = body.poll;

        const newPoll = new Poll({...poll, createdBy: user._id });
        poll = await newPoll.save();

        user.polls.push(poll._id);
        await user.save();

        res.json({
            success: 1,
            poll
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while creating the poll'
        });
    }
}

const getPoll = async (req, res) => {
    try {

        const results = await Promise.all([
            Poll.findById(req.params.id).populate('createdBy'),
            Response.find({for: req.params.id})
        ]);

        res.json({
            success: 1,
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

const getPolls = async ({ user }, res) => {
    try {
        const polls = await Poll.find({ createdBy: user._id, status: { $in: ['open', 'terminated']} }).populate('createdBy');

        res.json({
            success: 1,
            polls
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while getting the polls'
        });
    }
}

const updatePoll = async ({ body: { poll } }, res) => {
    try {
        await Poll.updateOne({ _id: poll._id,  }, poll);
        res.json({
            success: 1,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while updating the poll'
        });
    }
}

const deletePoll = async (req, res) => {
    try {
        await Poll.updateOne({ _id: req.params.id,  }, {status: 'deleted'});
        res.json({
            success: 1,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while deleting the poll'
        });
    }
}

const terminatePoll = async (req, res) => {
    try {
        await Poll.updateOne({ _id: req.params.id,  }, {status: 'terminated'});
        res.json({
            success: 1,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while terminating the poll'
        });
    }
}

const restorePoll = async (req, res) => {
    try {
        await Poll.updateOne({ _id: req.params.id,  }, {status: 'open'});
        res.json({
            success: 1,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while restoring the poll'
        });
    }
}

module.exports = {
    createPoll, getPolls, getPoll, updatePoll, deletePoll, terminatePoll, restorePoll
};