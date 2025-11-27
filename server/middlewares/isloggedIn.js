const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

module.exports.isloggedIn = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Attach user to request
        req.user = {
            id: user._id,
            role: user.role, // if needed later
            email: user.email
        };

        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

