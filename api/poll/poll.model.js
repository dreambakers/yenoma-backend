const { mongoose } = require('../../db/connection');

const pollSchema = new mongoose.Schema({
    questions: [
        {
            text: String,
            options: [{
                type: String,
            }],
            answerType: {
                type: String,
                enum: ['binary', 'rating', 'yesNoMaybe', 'slider', 'radioButton', 'checkbox'],
                default: 'binary'
            }
        }
    ],

    status: {
        type: String,
        enum: ['open', 'terminated', 'deleted'],
        default: 'open'
    },
    title: String,
    description: String,
    privateNote: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    allowNames: Boolean,
    allowComments: Boolean,
    password: String
}, {
    timestamps: true
});

const Poll = mongoose.model('Poll', pollSchema);
module.exports = {
    Poll
};