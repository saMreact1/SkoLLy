const express = require('express');
const router = express.Router();
const { getAllTeachers } = require('../controllers/teacher.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, getAllTeachers);


module.exports = router;
