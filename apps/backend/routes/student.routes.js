const express = require('express');
const router = express.Router();
const { getAllStudents, createStudent } = require('../controllers/student.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, getAllStudents);
router.post('/', authMiddleware, createStudent);


module.exports = router;
