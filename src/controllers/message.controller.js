const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');
const { fail, validId } = require('../middlewares/responses');
exports.send = async (req, res) => {
  const { senderId, content } = req.body;
  if (!validId(senderId)) return fail(res, 400, 'INVALID_ID', 'senderId inválido');
  const room = await Room.findById(req.params.id);
  if (!room) return fail(res, 404, 'ROOM_NOT_FOUND', 'Sala no existe');
  if (!room.members.some(m => m.toString() === senderId.toLowerCase())) return fail(res, 403, 'NOT_MEMBER', 'El usuario no pertenece a la sala');
  if (!await User.exists({ _id: senderId })) return fail(res, 404, 'USER_NOT_FOUND', 'Usuario no existe');
  const msg = await Message.create({ room: room._id, sender: senderId, content });
  await msg.populate('sender', 'username avatarUrl');
  res.status(201).json({ ok: true, data: msg });
};
exports.list = async (req, res) => {
  if (!await Room.exists({ _id: req.params.id })) return fail(res, 404, 'ROOM_NOT_FOUND', 'Sala no existe');
  const page = Number(req.query.page ?? 1), limit = Number(req.query.limit ?? 20);
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100)
    return fail(res, 400, 'VALIDATION', 'page debe ser >= 1 y limit entre 1 y 100');
  const filter = { room: req.params.id };
  const [items, total] = await Promise.all([
    Message.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).populate('sender', 'username avatarUrl'),
    Message.countDocuments(filter)
  ]);
  res.json({ ok: true, data: items, meta: { page, limit, total } });
};
exports.edit = async (req, res) => {
  const { senderId, content } = req.body;
  if (!validId(senderId)) return fail(res, 400, 'INVALID_ID', 'senderId inválido');
  const msg = await Message.findById(req.params.id);
  if (!msg) return fail(res, 404, 'MESSAGE_NOT_FOUND', 'Mensaje no existe');
  if (msg.sender.toString() !== senderId.toLowerCase()) return fail(res, 403, 'FORBIDDEN', 'Solo el autor puede editar el mensaje');
  msg.content = content;
  msg.edited = true;
  await msg.save();
  await msg.populate('sender', 'username avatarUrl');
  res.json({ ok: true, data: msg });
};
exports.remove = async (req, res) => {
  const { senderId } = req.body;
  if (!validId(senderId)) return fail(res, 400, 'INVALID_ID', 'senderId inválido');
  const msg = await Message.findById(req.params.id);
  if (!msg) return fail(res, 404, 'MESSAGE_NOT_FOUND', 'Mensaje no existe');
  if (msg.sender.toString() !== senderId.toLowerCase()) return fail(res, 403, 'FORBIDDEN', 'Solo el autor puede eliminar el mensaje');
  await msg.deleteOne();
  res.status(204).send();
};
