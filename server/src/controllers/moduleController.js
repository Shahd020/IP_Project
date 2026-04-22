// src/controllers/moduleController.js
const moduleService = require('../services/moduleService');
const quizService = require('../services/quizService');
const ForumPost = require('../models/ForumPost');

exports.getModules = async (req, res, next) => {
  try {
    const modules = await moduleService.getModulesByCourse(req.params.courseId);
    res.json({ success: true, data: { modules } });
  } catch (err) { next(err); }
};

exports.createModule = async (req, res, next) => {
  try {
    const mod = await moduleService.addModule(
      req.params.courseId, req.user.userId, req.user.role, req.body
    );
    res.status(201).json({ success: true, data: { module: mod } });
  } catch (err) { next(err); }
};

exports.updateModule = async (req, res, next) => {
  try {
    const mod = await moduleService.updateModule(
      req.params.moduleId, req.user.userId, req.user.role, req.body
    );
    res.json({ success: true, data: { module: mod } });
  } catch (err) { next(err); }
};

exports.deleteModule = async (req, res, next) => {
  try {
    await moduleService.deleteModule(req.params.moduleId, req.user.userId, req.user.role);
    res.status(204).end();
  } catch (err) { next(err); }
};

// GET /api/modules/:moduleId/details — module + quiz + recent forum posts in one call
exports.getModuleDetails = async (req, res, next) => {
  try {
    const module = await moduleService.getModuleById(req.params.moduleId);
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

    const [quiz, forumPosts] = await Promise.all([
      quizService.getQuizByModule(req.params.moduleId).catch(() => null),
      ForumPost.find({ module: req.params.moduleId })
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
    ]);

    res.json({ success: true, data: { module, quiz, forumPosts } });
  } catch (err) { next(err); }
};
