const { Payment } = require('./payment.model');
const { User } = require('../user/user.model');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const payPalClient = require('../utility/paypal-client');
const constants = require('../../constants');
const moment = require('moment');

const capturePayment = async (req, res) => {
    try {
        const { orderId, subscriptionPeriod } = req.body;
        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        const capture = await payPalClient.client().execute(request);

        if (capture.result.status === 'COMPLETED') {
            const user = req.user;
            const baseDate = new Date() < new Date(user.subscription.expires) ? user.subscription.expires : new Date();
            user.subscription.expires = moment(baseDate).add(subscriptionPeriod.duration, 'days').toISOString();
            await user.save();
            const newPayment = new Payment({
                result: capture.result,
                for: user._id
            });
            await newPayment.save();
            return res.json({
                success: 1,
                user
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while capturing the payment'
        });
    }
}

const getSubscriptionPeriods = async (req, res) => {
    try {
        res.json({
            success: 1,
            subscriptionPeriods: constants.subscriptionPeriods
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while capturing the payment'
        });
    }
}

module.exports = {
    capturePayment, getSubscriptionPeriods
};