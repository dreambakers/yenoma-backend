module.exports = {
    newUserSubscriptionPeriod: 30, // days
    feedbackRecipient: 'feedback@yenoma.com',
    emailSubjects: {
        signupVerification: 'messages.verifyYourEmail',
        forgotPassword: 'messages.passwordResetRequestReceived',
        feedback: 'messages.feedbackReceived'
    },
    emailTemplates: {
        signupVerification: 'signup-verification',
        forgotPassword: 'forgot-password',
        feedback: 'feedback'
    }
}
