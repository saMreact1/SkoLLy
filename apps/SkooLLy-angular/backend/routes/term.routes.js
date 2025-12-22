const router = require('express').Router();
const { getTermsBySession } = require('../controllers/session.controller');
const { createTerm, createSession, closeSession, getCurrentSession, getCurrentTerm, getAllSessions, getSessionsWithTerms, updateTermBySession } = require('../controllers/term.controller');
const { adminMiddleware } = require('../middlewares/admin.middleware');
const { authMiddleware } = require('../middlewares/auth.middleware');


router.get("/current", authMiddleware, getCurrentTerm)
router.get('/:sessionId', authMiddleware, adminMiddleware, getTermsBySession);
router.put('/:sessionId', authMiddleware, adminMiddleware, updateTermBySession);
router.post('/', authMiddleware, adminMiddleware, createTerm)


module.exports = router;