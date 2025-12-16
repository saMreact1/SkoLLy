const router = require('express').Router();
const { getOverview, getStudentsByClass, getGenderDistribution, getWeeklyAttendance, createTerm, createSession, closeSession } = require('../controllers/admin.controller');
const { adminMiddleware } = require('../middlewares/admin.middleware');
const { authMiddleware } = require('../middlewares/auth.middleware')

router.get('/overview', authMiddleware, getOverview);
router.get('/students-by-class', authMiddleware, getStudentsByClass);
router.get('/gender-distribution', authMiddleware, getGenderDistribution);
router.get('/weekly-attendance', authMiddleware, getWeeklyAttendance);

// term and session
router.post('/create-session', authMiddleware, adminMiddleware, createSession);
router.post('/create-term', authMiddleware, adminMiddleware, createTerm)
router.post('/close-session', authMiddleware, adminMiddleware, closeSession);


module.exports = router;