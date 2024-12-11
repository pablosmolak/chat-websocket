import mongoose from 'mongoose';

// Definindo o esquema de mensagem
const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Criando o modelo de mensagem
const Message = mongoose.model('Message', messageSchema);

export default Message;
