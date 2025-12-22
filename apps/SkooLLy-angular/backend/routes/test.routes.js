const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { teacherMiddleware } = require("../middlewares/teacher.middleware");
const { adminMiddleware } = require("../middlewares/admin.middleware");
const { createTest, approveTest, getTermTestBySubjectAndClass } = require("../controllers/test.controller");
const router = express.Router();


router
    .get("/", authMiddleware, getTermTestBySubjectAndClass)
    .post("/create", authMiddleware, teacherMiddleware, createTest)
    .post("/approve-test/:testId", authMiddleware, adminMiddleware, approveTest)



module.exports = router;