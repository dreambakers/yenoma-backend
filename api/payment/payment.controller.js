const { Payment } = require('./payment.model');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const payPalClient = require('../utility/paypal-client');
const constants = require('../../constants');

const capturePayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        console.log(orderId)

        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        const capture = await payPalClient.client().execute(request);

        if (capture.result === 'COMPLETED') {
            const newPayment = new Payment({
                result: capture.result,
                for: req.user._id
            });

            await newPayment.save();

            return res.send(200);
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