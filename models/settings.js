const { mongoose } = require('../db/connection');
const constants = require('../constants');
const Schema = mongoose.Schema;

const settingSchema = new mongoose.Schema({
    global: Object,
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingSchema);

module.exports = { Settings }