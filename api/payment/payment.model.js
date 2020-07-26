const { mongoose } = require('../../db/connection');
const constants = require('../../constants');
const Schema = mongoose.Schema;

const paymentSchema = new mongoose.Schema({
    result: Object,
    for: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = {
    Payment
};