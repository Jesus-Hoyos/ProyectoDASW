const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = 'clave-secreta-supersegura'; // Reemplaza con variable de entorno en producción

// Registro
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, contraseña } = req.body;
  const user = await User.findOne({ email, contraseña });
  if (!user) return res.status(401).send('Credenciales inválidas');

  const token = jwt.sign({ id: user._id, email: user.email, rol: user.rol }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, user });
});

// Middleware de autenticación
function verificarToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token requerido');
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = { id: decoded.id };
    next();
  } catch(err) {
    res.status(401).send('Token inválido');
  }
}

// Obtener perfil del usuario autenticado
router.get('/perfil', verificarToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).send('Usuario no encontrado');
  res.json(user);
});

// Admin: ver todos los usuarios
router.get('/all', verificarToken, async (req, res) => {
  if (req.user.rol !== 'admin') return res.status(403).send('Acceso denegado');
  const usuarios = await User.find({}, '-contraseña');
  res.json(usuarios);
});

// Admin: cambiar rol
router.put('/role/:id', verificarToken, async (req, res) => {
  if (req.user.rol !== 'admin') return res.status(403).send('Acceso denegado');
  const user = await User.findByIdAndUpdate(req.params.id, { rol: req.body.rol }, { new: true });
  res.json(user);
});

// Admin: eliminar usuario
router.delete('/:id', verificarToken, async (req, res) => {
  if (req.user.rol !== 'admin') return res.status(403).send('Acceso denegado');
  await User.findByIdAndDelete(req.params.id);
  res.send('Usuario eliminado');
});

module.exports = { router, verificarToken };
