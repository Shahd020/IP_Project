// src/controllers/forumController.js
const ForumPost = require('../models/ForumPost');

// POST /api/forum/posts — REST fallback when Socket.io is unavailable
exports.createPost = async (req, res, next) => {
  try {
    const { courseId, moduleId, text } = req.body;
    if (!courseId || !text?.trim()) {
      return res.status(400).json({ success: false, message: 'courseId and text are required' });
    }
    const post = await ForumPost.create({
      course: courseId,
      module: moduleId || null,
      author: req.user.userId,
      text: text.trim(),
    });
    await post.populate('author', 'name avatar');
    res.status(201).json({ success: true, data: { post } });
  } catch (err) { next(err); }
};

// GET /api/forum/posts?courseId=xxx&moduleId=yyy
exports.getPosts = async (req, res, next) => {
  try {
    const { courseId, moduleId } = req.query;
    const filter = {};
    if (courseId) filter.course = courseId;
    if (moduleId) filter.module = moduleId;
    const posts = await ForumPost.find(filter)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json({ success: true, data: { posts } });
  } catch (err) { next(err); }
};
