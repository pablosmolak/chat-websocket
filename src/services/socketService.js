import User from '../models/user.js';
import Room from '../models/ChatRoom.js';

export default function(socket) {
  socket.on('joinRoom', async (email, roomPassword, username) => {
    try {
      // Verifica se o usuário já existe
      const user = await User.findOne({ email });

      if (!user) {
        socket.emit('error', { message: 'Usuário não encontrado!' });
        return;
      }

      // Verifica a senha da sala
      const room = await Room.findOne({ password: roomPassword });

      if (!room) {
        socket.emit('error', { message: 'Sala não encontrada ou senha incorreta!' });
        return;
      }

      // Adiciona o usuário à sala
      socket.join(room._id.toString());

      // Envia o histórico de mensagens para o usuário
      socket.emit('history', room.messages);

      // Informa a entrada do usuário
      socket.to(room._id.toString()).emit('newUser', username);
      console.log(`${username} entrou na sala ${roomPassword}`);

    } catch (err) {
      console.error(err);
      socket.emit('error', { message: 'Erro ao conectar à sala!' });
    }
  });

  socket.on('sendMessage', async (message, roomId, username) => {
    try {
      // Salva a mensagem no banco
      const room = await Room.findById(roomId);
      const newMessage = { sender: username, content: message, timestamp: new Date() };
      room.messages.push(newMessage);
      await room.save();

      // Emite a mensagem para todos os usuários na sala
      io.to(roomId).emit('newMessage', newMessage);
    } catch (err) {
      console.error(err);
      socket.emit('error', { message: 'Erro ao enviar a mensagem!' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
}
