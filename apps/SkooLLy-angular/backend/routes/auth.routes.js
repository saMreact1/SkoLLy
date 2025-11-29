const multer = require('multer');
const router = require('express').Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { register, login, checkSchoolAndEmail, forgotPassword, resetPassword, verifyEmail, resendVerification } = require('../controllers/auth.controller');
const upload = require('../config/multer');

router.post('/register', upload.single('logo'), register);
router.post('/login', login);
router.post('/check', checkSchoolAndEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// router.get('/verify-email', verifyEmail)
// router.get('dashboard', auth, verifyUser, dashboardController);
// router.post('/resend-verification', authMiddleware, resendVerification)


module.exports = router;
