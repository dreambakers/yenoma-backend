const { User } = require('./user.model');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utility/mail');
const constants = require('../../constants');

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
        const token = await user.generateVerificationToken();
        const result = await sendEmail(
            newUser.email,
            constants.emailSubjects.signupVerification,
            constants.emailTemplates.signupVerification,
            {
                userEmail: newUser.email,
                verificationUrl: 'http://localhost:4200/verify?verificationToken=' + token
            }
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
        const result = await User.updateOne({ _id: req.user._id }, newProfile);
        res.json({
            success: result.nModified !== 0,
        });
    } catch (error) {
        console.log('An error occurred updating the user profile', error);
    }
}

const verifySignup = async (req, res) => {
    try {
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
        res.json({
            success: !!result.verified,
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
                const token = await user.generateVerificationToken();
                const result = await sendEmail(
                    req.body.email,
                    constants.emailSubjects.signupVerification,
                    constants.emailTemplates.signupVerification,
                    {
                        userEmail: req.body.email,
                        verificationUrl: 'http://localhost:4200/verify?verificationToken=' + token
                    }
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

module.exports = {
    login, signUp, logout, changePassword, refreshToken, updateProfile, getProfile, verifySignup, sendSignupVerificationEmail
}