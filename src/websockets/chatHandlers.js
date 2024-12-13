import chatService from '../services/chatServices.js';
import UserService from '../services/userServices.js';
import { Decrypt, Encrypt } from '../utils/encrypt.js';

const chatHandlers = (io, socket) => {

  socket.on('joinRoom', async ({ email, name, password }) => {
    try {
      console.log(`Usuário ${name} entrou na sala ${password}`)

      const idSala = Encrypt(password)

      const validRoom = await chatService.validateRoom(idSala);
      if (!validRoom) {
        socket.emit('error', 'Invalid room or password');
        return;
      }

      const user = await UserService.getUsuarioByEmail(email);
      if (!user) {
        UserService.createUser(name, email);
      }

      socket.join(idSala);

      const history = await chatService.getChatHistory(idSala);

      const decryptedHistory = history.map((msg) => ({
        ...msg,
        date: msg.date,
        name: msg.name,
        message: Decrypt(msg.message),
      }));

      socket.emit('chatHistory', decryptedHistory);

      socket.on('sendMessage', async ({ message, email }) => {
        let user = await UserService.getUsuarioByEmail(email);

        await chatService.saveMessage(idSala, {
          name: user.name,
          message: Encrypt(message),
          date: new Date(),
        });

        io.to(idSala).emit('newMessage', {
          name: user.name,
          message: message,
          date: new Date(),
        });

      });
    } catch (err) {
      console.error(err);
      socket.emit('error', 'An error occurred');
    }
  });
};

export default chatHandlers;