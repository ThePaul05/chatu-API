const Room = require('../models/Room');
const User = require('../models/User');
const Message = require('../models/Message');
const { fail, validId } = require('../middlewares/responses');
exports.create = async (req, res) => {
  const { name, description, isPrivate, ownerId } = req.body;
  if (!validId(ownerId)) return fail(res, 400, 'INVALID_ID', 'ownerId inválido');
  if (!await User.exists({ _id: ownerId })) return fail(res, 404, 'USER_NOT_FOUND', 'Propietario no existe');
  const room = await Room.create({ name, description, isPrivate, owner: ownerId, members: [ownerId] });
  res.status(201).json({ ok: true, data: room });
};
exports.list = async (req, res) => {
  const rooms = await Room.aggregate([
    { $match: { isPrivate: false } },
    { $addFields: { memberCount: { $size: '$members' } } },
    { $sort: { createdAt: -1 } }
  ]);
  res.json({ ok: true, data: rooms });
};
exports.get = async (req, res) => {
  const room = await Room.findById(req.params.id).populate('owner', 'username avatarUrl').populate('members', 'username avatarUrl status');
  if (!room) return fail(res, 404, 'ROOM_NOT_FOUND', 'Sala no existe');
  res.json({ ok: true, data: room });
};
exports.join = async (req, res) => {
  const { userId } = req.body;
  if (!validId(userId)) return fail(res, 400, 'INVALID_ID', 'userId inválido');
  if (!await User.exists({ _id: userId })) return fail(res, 404, 'USER_NOT_FOUND', 'Usuario no existe');
  const room = await Room.findById(req.params.id);
  if (!room) return fail(res, 404, 'ROOM_NOT_FOUND', 'Sala no existe');
  if (room.members.some(m => m.toString() === userId.toLowerCase())) return fail(res, 409, 'ALREADY_MEMBER', 'El usuario ya pertenece a la sala');
  // Adición atómica para evitar duplicados por solicitudes simultáneas.
  const updated = await Room.findOneAndUpdate({ _id: room._id, members: { $ne: userId } }, { $addToSet: { members: userId } }, { new: true });
  if (!updated) return fail(res, 409, 'ALREADY_MEMBER', 'El usuario ya pertenece a la sala');
  res.json({ ok: true, data: updated });
};
exports.leave = async (req, res) => {
  const { userId } = req.body;
  if (!validId(userId)) return fail(res, 400, 'INVALID_ID', 'userId inválido');
  const room = await Room.findById(req.params.id);
  if (!room) return fail(res, 404, 'ROOM_NOT_FOUND', 'Sala no existe');
  if (room.owner.toString() === userId.toLowerCase()) return fail(res, 403, 'OWNER_CANNOT_LEAVE', 'El propietario no puede abandonar su sala');
  if (!room.members.some(m => m.toString() === userId.toLowerCase())) return fail(res, 404, 'NOT_MEMBER', 'El usuario no pertenece a la sala');
  room.members.pull(userId);
  await room.save();
  res.json({ ok: true, data: room });
};
exports.remove = async (req, res) => {
  const { ownerId } = req.body;
  if (!validId(ownerId)) return fail(res, 400, 'INVALID_ID', 'ownerId inválido');
  const room = await Room.findById(req.params.id);
  if (!room) return fail(res, 404, 'ROOM_NOT_FOUND', 'Sala no existe');
  if (room.owner.toString() !== ownerId.toLowerCase()) return fail(res, 403, 'FORBIDDEN', 'Solo el propietario puede eliminar la sala');
  await Room.deleteOne({ _id: room._id });
  await Message.deleteMany({ room: room._id });
  res.status(204).send();
};
