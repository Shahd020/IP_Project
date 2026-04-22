// src/routes/moduleDetails.js — standalone module routes (not nested under courses)
// Provides GET /api/modules/:moduleId/details used by CourseStudy.jsx
const router = require('express').Router();
const { getModuleDetails } = require('../controllers/moduleController');
const protect = require('../middleware/protect');

router.get('/:moduleId/details', protect, getModuleDetails);

module.exports = router;
