const { mongoose } = require('../../db/connection');
const constants = require('../../constants');

const surveySchema = new mongoose.Schema({
    questions: [
        {
            text: String,
            options: [{
                type: String,
            }],
            answerType: {
                type: String,
                enum: constants.answerTypes,
                default: constants.defaultAnswerType
            },
            decimalPlaces: Number,
            minValue: Number,
            maxValue: Number,
            limits: {
                minChecks: Number,
                maxChecks: Number
            },
            allowOtherAnswer: Boolean,
            radioToDropdown: Boolean,
            additionalText: String,
            listElements: String
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
    password: String,
    inactiveComment: String,
    activeComment: String,
    terminatedAt: Date,
    responses: { type: Number, default: 0 },
    shortId: {
        type: String,
        unique: true,
    },
    automaticNumbering: Boolean,
    thankYouTitle: String,
    thankYouMessage: String
}, {
    timestamps: true
});

// generating a non-duplicate Code
surveySchema.pre('save', function(next){  // can't use arror function, or this will be undefinded. fat arrow is lexically scoped.
  let ctx = this;
  attempToGenerate(ctx, next);
});

function attempToGenerate(ctx, callback) {
    let newCode = generateBase58Id();
    ctx.constructor.findOne({'shortId': newCode}).then((survey) => {
      if (survey) {
        attempToGenerate(ctx, callback);
      }
      else {
        ctx.shortId = newCode;
        callback();
      }
    }, (err) => {
        callback(err);
    });
}

const generateBase58Id = () => {
    const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    let output = "";

    for (let i = 0; i < 8; i ++) {
        const index = Math.floor(Math.random() * (alphabet.length - 1)) + 1;
        output = output + alphabet[index];
    }
    return output;
}

const Survey = mongoose.model('Survey', surveySchema);
module.exports = {
    Survey
};