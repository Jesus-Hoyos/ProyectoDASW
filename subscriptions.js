const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const { verificarToken } = require('./users');


// Suscribirse a un proyecto
router.post('/', verificarToken, async (req, res) => {
  const existe = await Subscription.findOne({
    usuario_id: req.user.id,
    proyecto_id: req.body.proyecto_id
  });
  if (existe) return res.status(400).send('Ya estás suscrito');

  const nueva = new Subscription({
    usuario_id: req.user.id,
    proyecto_id: req.body.proyecto_id
  });

  await nueva.save();
  res.json(nueva);
});

// Ver proyectos suscritos
router.get('/mias', verificarToken, async (req, res) => {
  const subs = await Subscription.find({ usuario_id: req.user.id }).populate('proyecto_id');
  res.json(subs.map(s => s.proyecto_id));
});

module.exports = router;
