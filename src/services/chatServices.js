import ChatRoom from '../models/ChatRoom.js';
import bcrypt from 'bcrypt';

export default class chatService {
  static async validateRoom(password) {
    const chatRoom = await ChatRoom.find({ password });
    console.log(chatRoom)
    if (chatRoom.length === 0) {
      const sala = new ChatRoom({
        password: password,
        room: password
      });

      await sala.save();
    }
    return true;
  }

  static async getChatHistory(password) {
    const chatRoom = await ChatRoom.findOne({ password });
    return chatRoom ? chatRoom.messages : [];
  }

  static async saveMessage(password, message) {
    const chatRoom = await ChatRoom.findOne({ password });
    if (chatRoom) {
      chatRoom.messages.push(message);
      await chatRoom.save();
    }
  }

  static async getUserByEmail(email) {
    return await ChatRoom.findOne({ email });
  }
}
