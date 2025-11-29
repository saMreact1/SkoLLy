exports.verifyUser = (req, res, next) => {
    const user = req.user;

    if (!user || !user.isVerified) {
        return res.status(403).json({ message: "Please verify your email to continue." });
    }
    next();
};
