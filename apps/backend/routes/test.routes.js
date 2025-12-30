const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { teacherMiddleware } = require("../middlewares/teacher.middleware");
const { adminMiddleware } = require("../middlewares/admin.middleware");
const { createTest, approveTest, getTermTestBySubjectAndClass, getTestByClass, getTestById, createTestWithCSV } = require("../controllers/test.controller");
const router = express.Router();
const upload = require("../config/multer");

router
    .get("/", authMiddleware, getTermTestBySubjectAndClass)
    .post("/create", authMiddleware, teacherMiddleware, createTest)
    .post("/approve-test/:testId", authMiddleware, adminMiddleware, approveTest)
    .get("/class/:testClass", authMiddleware, getTestByClass)
    .get("/:testId", authMiddleware, getTestById)
    .post("/upload-csv", authMiddleware, teacherMiddleware, upload.single('csvFile'), createTestWithCSV)



module.exports = router;