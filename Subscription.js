const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  proyecto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
