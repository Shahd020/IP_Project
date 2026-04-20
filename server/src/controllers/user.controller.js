import userService from '../services/user.service.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── GET /api/users ───────────────────────────────────────────────────────────
const getAll = asyncHandler(async (req, res) => {
  const { page, limit, role, search } = req.query;
  const result = await userService.getAllUsers({ page, limit, role, search });
  res.status(200).json({ success: true, data: result });
});

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
const getOne = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({ success: true, data: { user } });
});

// ─── PATCH /api/users/:id ─────────────────────────────────────────────────────
const update = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(
    req.params.id,
    req.body,
    req.user._id,
    req.user.role
  );
  res.status(200).json({ success: true, message: 'User updated', data: { user } });
});

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
const remove = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user._id);
  res.status(200).json({ success: true, message: 'User deleted' });
});

// ─── PATCH /api/users/:id/toggle-active ──────────────────────────────────────
const toggleActive = asyncHandler(async (req, res) => {
  const user = await userService.toggleUserActive(req.params.id);
  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
    data: { user },
  });
});

export default { getAll, getOne, update, remove, toggleActive };
