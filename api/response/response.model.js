const { mongoose } = require('../../db/connection');

const responseSchema = new mongoose.Schema({
    questions: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            text: String,
            answers: [{
                _id: false,
                option: String,
                answer: String
            }],
            // In case no options defined for question
            answer: String,
            answerType:  {
                type: String,
                enum: ['binary', 'rating'],
                default: 'binary'
            }
        }
    ],
    for: { type:  mongoose.Schema.Types.ObjectId, ref: 'Poll' },
});

const Response = mongoose.model('Response', responseSchema);
module.exports = {
    Response
};