const { User } = require('./user.model');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../../utility/mail');
const constants = require('../../constants');
const jwt = require('jsonwebtoken');

const signUp = async (req, res) => {
    try {
        const newUser = new User({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username
        });

        const results = await Promise.all([
            User.findOne({ email: newUser.email }),
            User.findOne({ username: newUser.username })
        ]);

        if (results[0] || results[1]) {
            return res.status(400).send({
                alreadyExists: 1,
                email: !!results[0],
                username: !!results[1],
                success: 0
            });
        }

        const user = await newUser.save();
        const token = await user.generateToken('verification', 'verificationToken');
        const result = await sendEmail(
            newUser.email,
            constants.emailSubjects.signupVerification,
            constants.emailTemplates.signupVerification,
            {
                userEmail: newUser.email,
                verificationUrl: `${process.env.FE_URL}/verify?verificationToken=` + token
            },
            req.body.language
        );

        res.json({
            success: result.accepted.length
        });
    }

    catch (error) {
        console.log(error);
        res.status(400).send({
            success: 0
        });
    }
}


const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        bcrypt.compare(oldPassword, req.user.password, async (err, result) => {
            if (result && !err) {
                req.user.password = newPassword;
                await req.user.save();
                return res.status(200).send({ success: 1 });
            } else if (!err) {
                return res.status(400).send({ success: 0, incorrectPassword: true });
            } else {
                throw err;
            }
        });
    } catch (error) {
        console.log(`An error occurred changing the password against ${req.user._id}`, error);
        res.status(400).send({ success: 0 });
    }
}

const login = async (req, res) => {
    try {
        const { email, password, remember } = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user.verified) {
            return res.json({
                success: 0,
                notVerified: true
            });
        }
        const token = await user.generateAuthToken(remember);
        user.cleanupOldTokens();
        res.header('x-auth', token).send(user);
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: 0, notFound: error.notFound || 0 });
    }
}

const logout = async ({ user, token }, res) => {
    try {
        await user.removeToken(token);
        res.json({
            success: 1
        });
    } catch (error) {
        console.log('An error occurred logging out the user', error);
    }
}

const refreshToken = async (req, res) => {
    try {
        res.json({
            success: 1
        });
    } catch (error) {
        console.log('An error occurred refreshing the token', error);
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        res.json({
            user,
            success: !!user,
        });
    } catch (error) {
        console.log('An error occurred getting the user profile', error);
    }
}

const updateProfile = async (req, res) => {
    try {
        const newProfile = { ...req.body };

        if (newProfile.email || newProfile.username) {
            const results = await Promise.all([
                User.findOne({ email: newProfile.email, _id: { $ne: req.user._id } }),
                User.findOne({ username: newProfile.username, _id: { $ne: req.user._id } })
            ]);

            if (results[0] || results[1]) {
                return res.status(400).send({
                    alreadyExists: 1,
                    email: !!results[0],
                    username: !!results[1],
                    success: 0
                });
            }

        }

        delete newProfile['_id'];
        await User.updateOne({ _id: req.user._id }, newProfile);
        res.json({
            success: 1,
        });
    } catch (error) {
        console.log('An error occurred updating the user profile', error);
    }
}

const verifySignup = async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.body.verificationToken });
        if (user) {
            try {
                const decoded = jwt.verify(req.body.verificationToken, process.env.JWT_SECRET);
                const result = await User.findOneAndUpdate(
                    {
                        verificationToken: req.body.verificationToken
                    },
                    {
                        verified: true,
                        verificationToken: null
                    },
                    {
                    new: true
                    }
                );
                return res.json({
                    success: !!result.verified,
                });
            } catch(err) {
                return res.json({
                    success: 0,
                    invalidToken: true
                });
            }
        }
        res.json({
            success: 0,
            userNotFound: true
        });
    } catch (error) {
        console.log('An error occurred verifying the user', error);
        res.json({
            success: 0,
        });
    }
}

const sendSignupVerificationEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (user.verified) {
                return res.json({
                    success: 1,
                    alreadyVerified: true
                });
            } else {
                const token = await user.generateToken('verification', 'verificationToken', '48h');
                const result = await sendEmail(
                    req.body.email,
                    constants.emailSubjects.signupVerification,
                    constants.emailTemplates.signupVerification,
                    {
                        userEmail: req.body.email,
                        verificationUrl: `${process.env.FE_URL}/verify?verificationToken=` + token
                    },
                    req.body.language
                );
                res.json({
                    success: result.accepted.length
                });
            }
        } else {
            res.json({
                success: 1,
                userNotFound: true
            });
        }
    } catch (error) {
        console.log('An error occurred sending the verification email', error);
        res.json({
            success: 0,
        });
    }
}

const sendPasswordResetEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
                const token = await user.generateToken('password', 'passwordResetToken', '48h');
                const result = await sendEmail(
                    req.body.email,
                    constants.emailSubjects.forgotPassword,
                    constants.emailTemplates.forgotPassword,
                    {
                        passwordResetUrl: `${process.env.FE_URL}/password-reset?passwordResetToken=` + token
                    },
                    req.body.language
                );
                res.json({
                    success: result.accepted.length
                });
        } else {
            res.json({
                success: 1,
                userNotFound: true
            });
        }
    } catch (error) {
        console.log('An error occurred sending the password reset email', error);
        res.json({
            success: 0,
        });
    }
}

const verifyPasswordResetToken = async (req, res) => {
    try {
        const user = await User.findOne({ passwordResetToken: req.body.passwordResetToken });
        if (user) {
            try {
                const decoded = jwt.verify(req.body.passwordResetToken, process.env.JWT_SECRET);
                return res.json({
                    success: 1
                });
            } catch(err) {
                return res.json({
                    success: 0,
                });
            }
        }
        res.json({
            success: 0,
        });
    } catch (error) {
        console.log('An error occurred sending the password reset email', error);
        res.json({
            success: 0,
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({ passwordResetToken: req.body.passwordResetToken });
        if (user) {
            try {
                const decoded = jwt.verify(req.body.passwordResetToken, process.env.JWT_SECRET);
                user.password = req.body.newPassword;
                user.passwordResetToken = null;
                const result = await user.save();
                res.json({
                    success: 1
                });
            } catch(err) {
                res.json({
                    success: 0,
                    invalidToken: true
                });
            }
        } else {
            res.json({
                success: 0,
                userNotFound: true
            });
        }
    } catch (error) {
        console.log('An error occurred sending the password reset email', error);
        res.json({
            success: 0,
        });
    }
}

const getSubscription = async (req, res) => {
    try {
        const user = req.user;
        res.json({
            success: 1,
            subscription: {
                ...user.subscription,
                isPro: new Date() < new Date(user.subscription.expires)
            }
        })
    } catch (error) {
        console.log('An error occurred while getting the subscription', error);
        res.json({
            success: 0,
        });
    }
}

const sendFeedback = async (req, res) => {
    try {
        const { feedback } = req.body;
        const result = await sendEmail(
            constants.feedbackRecipient,
            constants.emailSubjects.feedback,
            constants.emailTemplates.feedback,
            {
                userEmail: req.user.email,
                feedback
            }
        );
        res.json({
            success: result.accepted.length
        });
    } catch (error) {
        console.log('An error occurred while sending the feedback', error);
        res.json({
            success: 0,
        });
    }
}

module.exports = {
    login,
    signUp,
    logout,
    changePassword,
    refreshToken,
    updateProfile,
    getProfile,
    verifySignup,
    sendSignupVerificationEmail,
    sendPasswordResetEmail,
    resetPassword,
    verifyPasswordResetToken,
    getSubscription,
    sendFeedback
}