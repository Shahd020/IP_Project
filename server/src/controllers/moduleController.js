const moduleService = require('../services/moduleService');

exports.getModules = async (req, res, next) => {
  try {
    const modules = await moduleService.getModulesByCourse(req.params.courseId);
    res.json(modules);
  } catch (err) { next(err); }
};

exports.createModule = async (req, res, next) => {
  try {
    const mod = await moduleService.addModule(
      req.params.courseId, req.user.userId, req.user.role, req.body
    );
    res.status(201).json(mod);
  } catch (err) { next(err); }
};

exports.updateModule = async (req, res, next) => {
  try {
    const mod = await moduleService.updateModule(
      req.params.moduleId, req.user.userId, req.user.role, req.body
    );
    res.json(mod);
  } catch (err) { next(err); }
};

exports.deleteModule = async (req, res, next) => {
  try {
    await moduleService.deleteModule(req.params.moduleId, req.user.userId, req.user.role);
    res.status(204).end();
  } catch (err) { next(err); }
};
