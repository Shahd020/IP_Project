const User = require('../models/User.js');
const Enrollment = require('../models/Enrollment.js');
const Course = require('../models/Course.js');
const ApiError = require('../utils/ApiError.js');

// ─── Read ─────────────────────────────────────────────────────────────────────

const getAllUsers = async ({ page = 1, limit = 20, role, search } = {}) => {
  const filter = {};

  if (role) filter.role = role;

  if (search) {
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

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

// ─── Write ────────────────────────────────────────────────────────────────────

const updateUser = async (targetId, data, requesterId, requesterRole) => {
  const user = await User.findById(targetId);
  if (!user) throw ApiError.notFound('User not found');

  const isSelf = targetId.toString() === requesterId.toString();
  const isAdmin = requesterRole === 'admin';

  if (!isSelf && !isAdmin) {
    throw ApiError.forbidden('You may only update your own profile');
  }

  if (!isAdmin) {
    delete data.role;
    delete data.isActive;
    delete data.email;
  }

  Object.assign(user, data);
  await user.save();
  return user;
};

const deleteUser = async (targetId, requesterId) => {
  if (targetId.toString() === requesterId.toString()) {
    throw ApiError.badRequest('You cannot delete your own account');
  }

  const user = await User.findById(targetId);
  if (!user) throw ApiError.notFound('User not found');

  await Promise.all([
    Enrollment.deleteMany({ student: targetId }),
    Course.deleteMany({ instructor: targetId }),
    user.deleteOne(),
  ]);
};

const toggleUserActive = async (targetId) => {
  const user = await User.findById(targetId);
  if (!user) throw ApiError.notFound('User not found');
  user.isActive = !user.isActive;
  await user.save();
  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserActive,
};