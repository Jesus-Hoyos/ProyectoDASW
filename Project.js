const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  creador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  estado: { type: String, enum: ['abierto', 'cerrado'], default: 'abierto' },
  fecha_creacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
