const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contenido: String,
  fecha_envio: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
