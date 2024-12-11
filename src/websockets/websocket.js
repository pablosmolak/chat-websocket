import { Server } from 'socket.io';
import chatHandlers from './chatHandlers.js';

export default (server) => {

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected');
    chatHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
