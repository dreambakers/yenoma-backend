module.exports = {
    emailSenderName: 'yenoma <noreply@yenoma.com>',
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
    },
    answerTypes: [
        'binary',
        'rating',
        'yesNoMaybe',
        'slider',
        'radioButton',
        'checkbox',
        'smiley',
        'text',
        'dropdown',
        'value',
        'email',
        'list'
    ],
    defaultAnswerType: 'yesNoMaybe',
    subscriptionPeriods: [{
        key: 'oneMonth',
        duration: 30,
        price: 10
    }, {
        key: 'threeMonths',
        duration: 90,
        price: 30
    },{
        key: 'oneYear',
        duration: 365,
        price: 60
    }]
}
