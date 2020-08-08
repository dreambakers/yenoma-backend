const { Settings } = require('../models/settings');

const performPostStartTasks = () => {
    Settings.find({}).then(
        settings => {
            if (!settings.length){
                settings = new Settings({
                    global: {
                        newUserSubscriptionPeriod: 30, // days
                    }
                });
                settings.save();
            }
        }
    ).catch(
        err => {
            console.log('An error occured while trying to insert the default settings into the DB', err);
        }
    );
}

const getGlobalSettings = async () => {
    try {
        const settings = await Settings.findOne({});
        if (!settings || !settings.global) {
            throw { msg: 'Global key not found', settings };
        }
        return settings.global;
    } catch (err) {
        console.log('An error occurred while getting the global settings', err);
    }
}

module.exports = {
    performPostStartTasks, getGlobalSettings
}