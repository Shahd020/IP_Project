const moduleService = require('../services/module.service.js');
const asyncHandler = require('../utils/asyncHandler.js');

// ─── GET /api/courses/:courseId/modules ───────────────────────────────────────
const getByCourse = asyncHandler(async (req, res) => {
  const modules = await moduleService.getModulesByCourse(req.params.courseId);
  res.status(200).json({ success: true, data: { modules } });
});

// ─── GET /api/modules/:moduleId/details ──────────────────────────────────────
const getDetails = asyncHandler(async (req, res) => {
  const data = await moduleService.getModuleWithDetails(req.params.moduleId);
  res.status(200).json({ success: true, data });
});

// ─── POST /api/courses/:courseId/modules ──────────────────────────────────────
const create = asyncHandler(async (req, res) => {
  const module = await moduleService.createModule(
    req.params.courseId,
    req.body,
    req.user._id,
    req.user.role
  );
  res.status(201).json({ success: true, message: 'Module created', data: { module } });
});

// ─── PATCH /api/modules/:moduleId ────────────────────────────────────────────
const update = asyncHandler(async (req, res) => {
  const module = await moduleService.updateModule(
    req.params.moduleId,
    req.body,
    req.user._id,
    req.user.role
  );
  res.status(200).json({ success: true, message: 'Module updated', data: { module } });
});

// ─── DELETE /api/modules/:moduleId ───────────────────────────────────────────
const remove = asyncHandler(async (req, res) => {
  await moduleService.deleteModule(req.params.moduleId, req.user._id, req.user.role);
  res.status(200).json({ success: true, message: 'Module deleted' });
});

module.exports = { getByCourse, getDetails, create, update, remove };