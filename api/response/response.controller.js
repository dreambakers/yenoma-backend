const { Response } = require('./response.model');

const recordResponse = async ({ body: { response } }, res) => {
    try {
        console.log(JSON.stringify(response))
        let newResponse = new Response(response);

        newResponse = await newResponse.save();

        res.json({
            success: 1,
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
            success: 1,
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

module.exports = {
    recordResponse, updateResponse
};