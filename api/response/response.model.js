const { mongoose } = require('../../db/connection');
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
                enum: [
                    'binary',
                    'rating',
                    'yesNoMaybe',
                    'slider',
                    'radioButton',
                    'checkbox',
                    'smiley',
                    'text',
                    'dropdown',
                    'value',
                    'email'
                ],
                default: 'binary'
            },
            decimalPlaces: Number,
            minValue: Number,
            maxValue: Number,
            otherAnswer: String
        }
    ],
    name: String,
    comments: String,
    for: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll' },
}, {
    timestamps: true
});

const Response = mongoose.model('Response', responseSchema);
module.exports = {
    Response
};