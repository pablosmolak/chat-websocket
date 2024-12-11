import ChatRoom from '../models/ChatRoom.js';
import bcrypt from 'bcrypt';
import { encryptMessage } from '../utils/encrypt.js';

export default class chatService {
  static async validateRoom(id) {

    const roomid = encryptMessage(id)
    const chatRoom = await ChatRoom.find({ password: roomid });

    if (chatRoom.length === 0) {
      const sala = new ChatRoom({
        password: roomid,
        room: roomid
      });

      await sala.save();
    }

    return true;
  }

  static async getChatHistory(id) {
    const roomid = encryptMessage(id)
    const chatRoom = await ChatRoom.findOne({ password: roomid });
    return chatRoom ? chatRoom.messages : [];
  }

  static async saveMessage(id, message) {
    const roomid = encryptMessage(id)
    const chatRoom = await ChatRoom.findOne({ password: roomid });
    if (chatRoom) {
      chatRoom.messages.push(message);
      await chatRoom.save();
    }
  }

  static async getUserByEmail(email) {
    return await ChatRoom.findOne({ email });
  }
}
