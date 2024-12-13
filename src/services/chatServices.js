import ChatRoom from '../models/ChatRoom.js';

export default class chatService {
  static async validateRoom(roomid) {

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

  static async getChatHistory(roomid) {
    const chatRoom = await ChatRoom.findOne({ password: roomid });
    return chatRoom ? chatRoom.messages : [];
  }

  static async saveMessage(roomid, message) {
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
