import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import ApiError from '../utils/ApiError.js';

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Paginated list of all users — Admin dashboard (ManageUsers.jsx).
 * Supports optional role filter and name/email search.
 *
 * @param {{ page?, limit?, role?, search? }} opts
 * @returns {{ users: object[], total: number, page: number, pages: number }}
 */
const getAllUsers = async ({ page = 1, limit = 20, role, search } = {}) => {
  const filter = {};

  if (role) filter.role = role;

  if (search) {
    // Case-insensitive search on name or email
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return { users, total, page: Number(page), pages: Math.ceil(total / limit) };
};

/**
 * @param {string} userId
 * @param {string} requesterId
 * @param {string} requesterRole
 * @returns {object}
 */
const getUserById = async (userId, requesterId, requesterRole) => {
  if (requesterRole !== 'admin' && userId.toString() !== requesterId.toString()) {
    throw ApiError.forbidden('You may only view your own profile');
  }
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Partial update.
 *
 * Non-admin users may only update their own name, avatar, and password.
 * Admins may additionally change role and isActive on any user.
 *
 * @param {string} targetId   - User being updated
 * @param {object} data       - Fields to update
 * @param {string} requesterId
 * @param {string} requesterRole
 * @returns {object} Updated user
 */
const updateUser = async (targetId, data, requesterId, requesterRole) => {
  const user = await User.findById(targetId);
  if (!user) throw ApiError.notFound('User not found');

  const isSelf = targetId.toString() === requesterId.toString();
  const isAdmin = requesterRole === 'admin';

  if (!isSelf && !isAdmin) {
    throw ApiError.forbidden('You may only update your own profile');
  }

  // Non-admins cannot promote themselves or deactivate accounts
  if (!isAdmin) {
    delete data.role;
    delete data.isActive;
    delete data.email;
  }

  Object.assign(user, data);
  await user.save();
  return user;
};

/**
 * Hard-delete a user, cascade-removing their enrollments and courses.
 * An admin cannot delete their own account.
 *
 * @param {string} targetId
 * @param {string} requesterId
 */
const deleteUser = async (targetId, requesterId) => {
  if (targetId.toString() === requesterId.toString()) {
    throw ApiError.badRequest('You cannot delete your own account');
  }

  const user = await User.findById(targetId);
  if (!user) throw ApiError.notFound('User not found');

  // Cascade: remove enrollments if student, courses if instructor
  await Promise.all([
    Enrollment.deleteMany({ student: targetId }),
    Course.deleteMany({ instructor: targetId }),
    user.deleteOne(),
  ]);
};

/**
 * Toggle the isActive flag for a user account (admin action).
 *
 * @param {string} targetId
 * @returns {object} Updated user
 */
const toggleUserActive = async (targetId) => {
  const user = await User.findById(targetId);
  if (!user) throw ApiError.notFound('User not found');
  user.isActive = !user.isActive;
  await user.save();
  return user;
};

export default { getAllUsers, getUserById, updateUser, deleteUser, toggleUserActive };
