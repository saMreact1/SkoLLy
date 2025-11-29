const router = require('express').Router();
const { getOverview, getStudentsByClass, getGenderDistribution, getWeeklyAttendance } = require('../controllers/admin.controller');
const { authMiddleware } = require('../middlewares/auth.middleware')

router.get('/overview', authMiddleware, getOverview);
router.get('/students-by-class', authMiddleware, getStudentsByClass);
router.get('/gender-distribution', authMiddleware, getGenderDistribution);
router.get('/weekly-attendance', authMiddleware, getWeeklyAttendance);


module.exports = router;