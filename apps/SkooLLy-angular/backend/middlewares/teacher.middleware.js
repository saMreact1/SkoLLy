exports.teacherMiddleware = async (req, res, next) => {
    const { role } = req.user;
    if (role !== "teacher") return res.status(401).json({ message: "Unauthorized - Only Teachers can access this." });
    next();
}