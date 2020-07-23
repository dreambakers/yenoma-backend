const { mongoose } = require('../../db/connection');
const constants = require('../../constants');
const Schema = mongoose.Schema;

const responseSchema = new mongoose.Schema({
    questions: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            answers: [{
                _id: false,
                answer: Schema.Types.Mixed
            }],
            // In case no options defined for question
            answer: Schema.Types.Mixed,
            answerType:  {
                type: String,
                enum: constants.answerTypes,
                default: constants.defaultAnswerType
            },
            decimalPlaces: Number,
            minValue: Number,
            maxValue: Number,
            otherAnswer: String
        }
    ],
    name: String,
    comments: String,
    for: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' },
}, {
    timestamps: true
});

const Response = mongoose.model('Response', responseSchema);
module.exports = {
    Response
};