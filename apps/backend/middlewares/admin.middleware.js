/**
 * Node modules
 */
const dotenv = require("dotenv");
dotenv.config();

exports.adminMiddleware = async (req, res, next) => {
    const { role } = req.user;
    try {
        if (role !== "admin") return res.status(403).json({ message: "Unauthorized - You are not authorized to access this" });
        // if role is admin
        next();
    } catch (error) {
        console.log("Error occurred in the admin middleware -: ", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}