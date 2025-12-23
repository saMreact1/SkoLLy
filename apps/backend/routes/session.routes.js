const router = require('express').Router();
const { createTerm, createSession, closeSession, getCurrentSession, getCurrentTerm, getAllSessions, getSessionsWithTerms, getCurrentSessionWithTerms, getSessionById } = require('../controllers/session.controller');
const { adminMiddleware } = require('../middlewares/admin.middleware');
const { authMiddleware } = require('../middlewares/auth.middleware');


router.get('/', authMiddleware, adminMiddleware, getAllSessions);
router.get('/with-terms', authMiddleware, adminMiddleware, getSessionsWithTerms);
router.post('/create-session', authMiddleware, adminMiddleware, createSession);
router.post('/create-term', authMiddleware, adminMiddleware, createTerm)
router.post('/close-session', authMiddleware, adminMiddleware, closeSession);
router.get("/current-session", authMiddleware, getCurrentSession)
router.get("/current-term", authMiddleware, getCurrentTerm);
router.get("/current-session-with-terms", authMiddleware, getCurrentSessionWithTerms);
router.get("/:sessionId", authMiddleware, getSessionById);

module.exports = router;