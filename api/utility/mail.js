const Email = require('email-templates');
const path = require('path');
const { translate } = require('../utility/translate');
const constants = require('../../constants');

const sendEmail = async (to, subjectKey, template, locals, language = 'en') => {
    try {
        const email = new Email({
            template: path.join(__dirname, '..', '..', 'emails', template),

            message: {
                from: constants.emailSenderName,
                subject: translate(language, subjectKey.split('.')[0], subjectKey.split('.')[1]),
                to,
            },
            locals: { ...locals, translate, language },
            send: true,
            transport: {
                host: "smtp.strato.de",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: 'noreply@yenoma.com', // generated ethereal user
                  pass: process.env.EMAIL_PASS, // generated ethereal password
                },
            }
        });

        return await email.send({
            template: template,
            locals: { ...locals, translate, language },
        });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    sendEmail
}