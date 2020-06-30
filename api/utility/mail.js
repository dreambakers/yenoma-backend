const Email = require('email-templates');
const path = require('path');

const sendEmail = async (to, subject, template, locals) => {

    try {
        const email = new Email({
            template: path.join(__dirname, '..', '..', 'emails', template),

            message: {
                from: 'noreply@yenoma.com',
                subject,
                to,
            },
            locals,
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
            locals
        });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    sendEmail
}