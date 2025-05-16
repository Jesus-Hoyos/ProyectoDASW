const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { verificarToken } = require('./users'); 


// Enviar mensaje
router.post('/', verificarToken, async (req, res) => {
  const nuevo = new Message({
    usuario_id: req.user.id,
    proyecto_id: req.body.proyecto_id,
    contenido: req.body.contenido
  });
  await nuevo.save();
  res.json(nuevo);
});

// Ver historial de mensajes de un proyecto
router.get('/:proyecto_id', verificarToken, async (req, res) => {
  const mensajes = await Message.find({ proyecto_id: req.params.proyecto_id }).populate('usuario_id');
  res.json(mensajes);
});

module.exports = router;
