import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRoutes from './src/routes/userRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import chatService from './src/services/chatServices.js';
import cors from 'cors';
import UserService from './src/services/userServices.js';

// App setup
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: '*', // Permitir apenas o domínio específico
    methods: ['GET', 'POST'], // Métodos permitidos
  }
});

app.use(cors());

app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //useCreateIndex: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// WebSocket logic

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('joinRoom', async ({ email, name, password }) => {
    try {
      console.log(password)
      const validRoom = await chatService.validateRoom(password);
      if (!validRoom) {
        socket.emit('error', 'Invalid room or password');
        return;
      }

      socket.join(password);

      // Send chat history to the user
      const history = await chatService.getChatHistory(password);
      socket.emit('chatHistory', history);

      socket.on('sendMessage', async ({ message, email }) => {
        let user = await UserService.getUsuarioByEmail(email);
        if (!user) {
          user =  await UserService.createUser(name,email)
        }

        const chatMessage = {
          name: user.name,
          message,
          date: new Date(),
        };

        await chatService.saveMessage(password, chatMessage);
        io.to(password).emit('newMessage', chatMessage);
      });
    } catch (err) {
      console.error(err);
      socket.emit('error', 'An error occurred');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
