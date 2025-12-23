const express = require('express');
const router = express.Router();
const { createSubject, getSubject, updateSubject, deleteSubject } = require('../controllers/subject.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, createSubject);
router.get('/', authMiddleware, getSubject);
router.put('/:id', authMiddleware, updateSubject);
router.delete('/:id', authMiddleware, deleteSubject);


module.exports = router;
