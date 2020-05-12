const { User } = require('../api/user/user.model');

const authenticate = (req, res, next) => {

    const token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        } else {
            const dbTokenObject = user.tokens.find(tokenObject => tokenObject.token === token);
            if (dbTokenObject.remember || tokenValid(dbTokenObject.lastUse)) {
                req.user = user;
                req.token = token;
                if (!dbTokenObject.remember) {
                    // TODO: user instance obj
                    User.updateOne(
                        { _id: user._id, 'tokens.token': token },
                        { $set: { "tokens.$.lastUse": Date.now() }},
                    ).exec();
                }
                next();
            } else {
                // TODO: user instance obj
                User.updateOne(
                    { _id: user._id },
                    {
                        $pull: { tokens: { token } },
                    }
                ).exec();
                throw { tokenExpired: true };
            }
        }
    }).catch((e) => {
        res.status(401).send('Not authorized');
    });

};

const tokenValid = (lastActivity) => {
    // const THREE_HOURS = 3 * 1000 * 60 * 60;
    const THREE_HOURS = 10000;
    return ((new Date) - lastActivity) < THREE_HOURS;
}

module.exports = { authenticate };
