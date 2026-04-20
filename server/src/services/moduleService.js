const Module = require('../models/Module');
const Course = require('../models/Course');

const assertOwnership = (course, instructorId, role) => {
  if (role !== 'admin' && String(course.instructor) !== String(instructorId)) {
    const err = new Error('Forbidden'); err.statusCode = 403; throw err;
  }
};

const getModulesByCourse = async (courseId) =>
  Module.find({ course: courseId }).sort('order').lean();

const addModule = async (courseId, instructorId, role, data) => {
  const course = await Course.findById(courseId).select('instructor');
  if (!course) { const err = new Error('Course not found'); err.statusCode = 404; throw err; }
  assertOwnership(course, instructorId, role);

  const count = await Module.countDocuments({ course: courseId });
  return Module.create({ course: courseId, ...data, order: data.order ?? count + 1, content: data.content ?? [] });
};

const updateModule = async (moduleId, instructorId, role, data) => {
  const mod = await Module.findById(moduleId).populate('course', 'instructor');
  if (!mod) { const err = new Error('Module not found'); err.statusCode = 404; throw err; }
  assertOwnership(mod.course, instructorId, role);
  Object.assign(mod, data);
  return mod.save();
};

const deleteModule = async (moduleId, instructorId, role) => {
  const mod = await Module.findById(moduleId).populate('course', 'instructor');
  if (!mod) { const err = new Error('Module not found'); err.statusCode = 404; throw err; }
  assertOwnership(mod.course, instructorId, role);
  await mod.deleteOne();
};

module.exports = { getModulesByCourse, addModule, updateModule, deleteModule };
