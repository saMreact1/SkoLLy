const express = require('express');
const router = express.Router();
const { getNotices, createNotices, deleteNotices, updateNotices } = require('../controllers/notice.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');


router.post('/', authMiddleware, createNotices);
router.get('/', authMiddleware, getNotices);
router.delete('/:id', authMiddleware, deleteNotices);
router.put('/:id', authMiddleware, updateNotices);


module.exports = router;