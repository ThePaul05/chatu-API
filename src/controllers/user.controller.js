const User = require('../models/User');
const { fail } = require('../middlewares/responses');
exports.create = async (req, res) => {
  const { username, email, avatarUrl, status } = req.body;
  const user = await User.create({ username, email, avatarUrl, status });
  res.status(201).json({ ok: true, data: user });
};
exports.list = async (req, res) => {
  const filter = {};
  if (req.query.status !== undefined) {
    if (!['online', 'offline', 'away'].includes(req.query.status)) return fail(res, 400, 'VALIDATION', 'Estado inválido');
    filter.status = req.query.status;
  }
  const users = await User.find(filter).sort({ createdAt: -1 });
  res.json({ ok: true, data: users });
};
exports.get = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return fail(res, 404, 'USER_NOT_FOUND', 'Usuario no existe');
  res.json({ ok: true, data: user });
};
exports.changeStatus = async (req, res) => {
  if (!['online', 'offline', 'away'].includes(req.body.status)) return fail(res, 400, 'VALIDATION', 'Estado inválido');
  const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!user) return fail(res, 404, 'USER_NOT_FOUND', 'Usuario no existe');
  res.json({ ok: true, data: user });
};
