// src/services/userService.js
// Admin-facing user management — maps to ManageUsers.jsx in the Admin dashboard.
const User = require('../models/User');

/**
 * Returns all users. Admin only.
 * Excludes password and refreshTokens — schema select:false handles password,
 * but we explicitly project out refreshTokens for defence in depth.
 *
 * @returns {Promise<object[]>}
 */
const getAllUsers = async () => {
  return User.find().select('-refreshTokens').sort({ createdAt: -1 }).lean();
};

/**
 * Returns a single user by ID.
 *
 * @param {string} userId
 * @returns {Promise<object>}
 * @throws {Error} 404 if not found
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-refreshTokens');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

/**
 * Updates a user's name, email, or role.
 * Admin only. Uses runValidators to enforce schema rules on update.
 *
 * @param {string} userId
 * @param {{ name?: string, email?: string, role?: string }} updates
 * @returns {Promise<object>} Updated user document
 * @throws {Error} 404 if not found
 */
const updateUser = async (userId, updates) => {
  // Prevent password from being updated through this route —
  // password changes must go through a dedicated /change-password endpoint.
  delete updates.password;
  delete updates.refreshTokens;

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select('-refreshTokens');

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

/**
 * Deletes a user. Admin only.
 * Prevents deletion of the last admin to avoid locking out the system.
 *
 * @param {string} userId
 * @param {string} requestingAdminId - The admin performing the deletion
 * @throws {Error} 400 if deleting self, 404 if not found
 */
const deleteUser = async (userId, requestingAdminId) => {
  if (userId === requestingAdminId) {
    const err = new Error('You cannot delete your own account');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  // Guard: ensure at least one admin will remain after deletion
  if (user.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      const err = new Error('Cannot delete the last admin account');
      err.statusCode = 400;
      throw err;
    }
  }

  await User.findByIdAndDelete(userId);
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
