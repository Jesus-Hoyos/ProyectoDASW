const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Importar rutas y modelos
const { router: userRoutes, verificarToken } = require('./routes/users');
const projectRoutes = require('./routes/projects');
const subscriptionRoutes = require('./routes/subscriptions');
const messageRoutes = require('./routes/messages');
const Message = require('./models/Message');

// Inicializar app y servidor
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/estudiantes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Error al conectar MongoDB:", err));

// Rutas REST
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/messages', messageRoutes);

// WebSocket para chat en tiempo real
io.on('connection', (socket) => {
  console.log('🟢 Usuario conectado al chat');

  socket.on('nuevoMensaje', async (data) => {
    const { usuario_id, contenido } = data;
    const mensaje = new Message({ usuario_id, contenido }); // sin proyecto_id
    await mensaje.save();
    io.emit('mensajeRecibido', mensaje); // se envía a todos
  });

  socket.on('disconnect', () => {
    console.log('🔴 Usuario salió del chat');
  });
});


// Iniciar servidor
server.listen(3000, () => {
  console.log("🚀 Servidor backend corriendo en http://localhost:3000");
});
