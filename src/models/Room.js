const { Schema, model } = require('mongoose');
const roomSchema = new Schema({
  name: { type: String, required: [true, 'El nombre es obligatorio'], unique: true, trim: true },
  description: { type: String, default: '', trim: true },
  isPrivate: { type: Boolean, default: false },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
module.exports = model('Room', roomSchema);
