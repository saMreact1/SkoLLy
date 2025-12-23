const express = require('express');
const router = express.Router();
const { createSchool, getSchoolProfile, getSchoolByName } = require('../controllers/school.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, createSchool);
router.get('/profile', authMiddleware, getSchoolProfile);
router.get('/name/:name', getSchoolByName);


module.exports = router;
