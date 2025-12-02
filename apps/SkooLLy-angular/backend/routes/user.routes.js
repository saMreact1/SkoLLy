const express = require('express');
const router = express.Router();
const { getUser, updateProfile, uploadProfilePic } = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/user', authMiddleware, getUser);
router.patch('/update-profile', authMiddleware, updateProfile);
router.patch('/upload-profile-pic', authMiddleware, upload.single('profilePic'), uploadProfilePic);
router.put('/edit/:id', upload.single('profilePic'), updateProfile)
// router.get('/:id', getUserById);


module.exports = router;