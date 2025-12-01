const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blacklistToken.model");

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token) {
        return res.status(401).json({message : "Unauthorized Access"});
    }

    const isBlacklisted = await blackListTokenModel.findOne({token: token});
    if(isBlacklisted) {
        return res.status(401).json({message : "Unauthorized Access"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized Access" });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({message : "Unauthorized Access"});
    }
}