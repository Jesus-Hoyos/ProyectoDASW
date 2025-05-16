const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  contraseña: String,
  carrera: String,
  fecha_registro: { type: Date, default: Date.now },
  rol: { type: String, default: 'estudiante' }
});

module.exports = mongoose.model('User', userSchema);
