const router = require('express').Router();
const { getTermsBySession } = require('../controllers/session.controller');
const { createTerm, createSession, closeSession, getCurrentSession, getCurrentTerm, getAllSessions, getSessionsWithTerms } = require('../controllers/term.controller');
const { adminMiddleware } = require('../middlewares/admin.middleware');
const { authMiddleware } = require('../middlewares/auth.middleware');


router.get('/:sessionId', authMiddleware, adminMiddleware, getTermsBySession);
router.post('/', authMiddleware, adminMiddleware, createTerm)
router.get("/current", authMiddleware, getCurrentTerm);


module.exports = router;