import ForumPost from '../models/ForumPost.js';
import ApiError from '../utils/ApiError.js';

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Paginated forum posts for a course, optionally scoped to a module.
 * Primary read path for the CourseStudy forum tab on initial load.
 * Populates author name+avatar in the same query — no N+1.
 *
 * @param {string} courseId
 * @param {string} [moduleId]
 * @param {{ page?, limit? }} options
 * @returns {object[]}
 */
const getPostsByCourse = async (courseId, moduleId, { page = 1, limit = 20 } = {}) => {
  const filter = { course: courseId, isDeleted: false };
  if (moduleId) filter.module = moduleId;

  const skip = (page - 1) * limit;

  return ForumPost.find(filter)
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Create a forum post via the REST API (real-time path goes through Socket.io).
 *
 * @param {{ courseId, moduleId?, text, authorId }} data
 * @returns {object} Populated post
 */
const createPost = async ({ courseId, moduleId, text, authorId }) => {
  const post = await ForumPost.create({
    course: courseId,
    module: moduleId || null,
    author: authorId,
    text,
  });
  return post.populate('author', 'name avatar');
};

/**
 * Soft-delete a post. Only the author or an admin may delete.
 *
 * @param {string} postId
 * @param {string} userId
 * @param {string} userRole
 */
const deletePost = async (postId, userId, userRole) => {
  const post = await ForumPost.findById(postId);
  if (!post) throw ApiError.notFound('Post not found');

  if (userRole !== 'admin' && post.author.toString() !== userId.toString()) {
    throw ApiError.forbidden('You cannot delete this post');
  }

  post.isDeleted = true;
  await post.save();
};

export default { getPostsByCourse, createPost, deletePost };
