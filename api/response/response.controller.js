const { Response } = require('./response.model');
const { Poll } = require('../poll/poll.model');

const recordResponse = async ({ body: { response } }, res) => {
    try {
        let newResponse = new Response(response);
        newResponse = await newResponse.save();
        Poll.findByIdAndUpdate(response.for, {$inc : {'responses' : 1}}).exec();
        res.json({
            success: !!newResponse,
            response: newResponse
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while recording the response'
        });
    }
}


const updateResponse = async ({ body: { response } }, res) => {
    try {
        const updatedResponse = await Response.findOneAndUpdate({ _id: response._id }, response, { new: true });
        res.json({
            success: !!updatedResponse,
            response: updatedResponse
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while updating the response'
        });
    }
}

const getResponseForPoll = async ( { params, user }, res) => {
    try {
        const responses = await Response.find(
            { for: params.pollId }
        ).populate('for');

        if (responses.length) {
            const filteredResponses = responses.filter(
                response => response.for.createdBy.toString() === user._id.toString()
            );
            if (filteredResponses.length) {
                return res.json({
                    success: 1,
                    responses
                });
            }
        }
        throw { msg: `No response found against PollID: ${params.pollId}` };
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while getting the responses'
        });
    }
}

const getResponse = async ( { params, user }, res) => {
    try {
        const response = await Response.findById(params.responseId).populate('for');
        if (response.for.createdBy.toString() === user._id.toString()) {
            return res.json({
                success: 1,
                response
            });
        }
        throw { msg: `No response found against: ${params.responseId} & creator ${user._id}` };
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while getting the response'
        });
    }
}

const deleteResponse = async ( { params, user }, res) => {
    try {
        const response = await Response.findById(params.responseId).populate('for');
        if (response.for.createdBy.toString() === user._id.toString()) {
            Poll.findByIdAndUpdate(response.for, {$inc : {'responses' : -1}}).exec();
            await Response.findByIdAndDelete(params.responseId);
            return res.json({
                success: 1,
            });
        }
        throw { msg: `No response found against: ${params.responseId} & creator ${user._id}` };
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while deleting the response'
        });
    }
}

const verifyValidity = async ( { params, user }, res) => {
    try {
        const response = await Response.findById(params.responseId);
        return res.json({
            success: !!response,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while getting the response'
        });
    }
}

module.exports = {
    recordResponse, updateResponse, getResponseForPoll, getResponse, deleteResponse, verifyValidity
};