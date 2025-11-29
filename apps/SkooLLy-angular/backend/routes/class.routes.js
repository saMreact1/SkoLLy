const express = require('express');
const router = express.Router();
const classController = require('../controllers/class.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');


router.post('/', authMiddleware, classController.createClass);
router.get('/', authMiddleware, classController.getClasses);
router.get('/school/:tenantId', classController.getClassesByTenantId);
router.get('/:id/students', authMiddleware, classController.getClassStudents);
router.put('/:id', authMiddleware, classController.updateClass);
router.delete('/:id', authMiddleware, classController.deleteClass);
router.put('/:classId/assign-teacher', authMiddleware, classController.assignTeacher);


module.exports = router;
