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
            req.user.subscription.expires = moment(req.user.subscription.expires).add(subscriptionPeriod.duration, 'days').toISOString();
            await req.user.save();
            const newPayment = new Payment({
                result: capture.result,
                for: req.user._id
            });
            await newPayment.save();
            return res.json({
                success: 1,
                user: req.user
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