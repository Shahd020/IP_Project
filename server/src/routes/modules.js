// Nested under /api/courses/:courseId/modules — mergeParams exposes courseId
const router = require('express').Router({ mergeParams: true });
const { getModules, createModule, updateModule, deleteModule } = require('../controllers/moduleController');
const protect = require('../middleware/protect');
const authorize = require('../middleware/authorize');

// Public: anyone can view a course's module list
router.get('/', getModules);

// Protected: only instructor / admin can mutate
router.post('/',                protect, authorize('instructor', 'admin'), createModule);
router.patch('/:moduleId',      protect, authorize('instructor', 'admin'), updateModule);
router.delete('/:moduleId',     protect, authorize('instructor', 'admin'), deleteModule);

module.exports = router;
