  const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { verificarToken } = require('./users');

//  Obtener todos los proyectos (explorar)
router.get('/', async (req, res) => {
  try {
    const proyectos = await Project.find().sort({ fecha_creacion: -1 });
    res.json(proyectos);
  } catch (err) {
    console.error("Error al obtener proyectos públicos:", err);
    res.status(500).send('Error al obtener proyectos');
  }
});

//  Ver proyectos del usuario autenticado
router.get('/mios', verificarToken, async (req, res) => {
  try {
    const proyectos = await Project.find({ creador_id: req.user.id });
    res.json(proyectos);
  } catch (err) {
    console.error("Error en /mios:", err);
    res.status(500).send('Error al cargar proyectos');
  }
});

//  Crear un nuevo proyecto
router.post('/', verificarToken, async (req, res) => {
  try {
    const nuevo = new Project({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      creador_id: req.user.id
    });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    console.error("Error al crear proyecto:", err);
    res.status(500).send('Error en el servidor');
  }
});

//  Obtener un proyecto por ID
router.get('/:id', async (req, res) => {
  try {
    const proyecto = await Project.findById(req.params.id);
    if (!proyecto) return res.status(404).send('Proyecto no encontrado');
    res.json(proyecto);
  } catch (err) {
    res.status(400).send('ID inválido');
  }
});

module.exports = router;
