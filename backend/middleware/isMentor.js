const userModel = require('../models/user');

async function isMentor(req, res, next) {
    try {
        const user = await userModel.findById(req.user.userId);
        if (user.role !== "mentor") {
            return res.status(403).json({ error: "Access denied" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message:error.message});
         };
    }

module.exports = { isMentor };
