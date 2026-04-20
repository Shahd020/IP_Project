import forumService from '../services/forum.service.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── GET /api/forum/course/:courseId ─────────────────────────────────────────
const getByCourse = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const posts = await forumService.getPostsByCourse(
    req.params.courseId,
    null,
    { page, limit }
  );
  res.status(200).json({ success: true, data: { posts } });
});

// ─── GET /api/forum/module/:moduleId ─────────────────────────────────────────
const getByModule = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const posts = await forumService.getPostsByCourse(
    req.query.courseId,
    req.params.moduleId,
    { page, limit }
  );
  res.status(200).json({ success: true, data: { posts } });
});

// ─── POST /api/forum/posts ────────────────────────────────────────────────────
const create = asyncHandler(async (req, res) => {
  const { courseId, moduleId, text } = req.body;
  const post = await forumService.createPost({
    courseId,
    moduleId,
    text,
    authorId: req.user._id,
  });
  res.status(201).json({ success: true, data: { post } });
});

// ─── DELETE /api/forum/posts/:postId ─────────────────────────────────────────
const remove = asyncHandler(async (req, res) => {
  await forumService.deletePost(req.params.postId, req.user._id, req.user.role);
  res.status(200).json({ success: true, message: 'Post deleted' });
});

export default { getByCourse, getByModule, create, remove };
