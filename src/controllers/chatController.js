import ChatService from '../services/chatServices.js';

export default class ChatController {
  static async joinRoom(req, res) {
    const { room, password, email } = req.body;
    try {
      const validRoom = await ChatService.validateRoom(room, password);
      if (!validRoom) return res.status(400).json({ message: 'Invalid room or password' });

      const history = await ChatService.getChatHistory(room);
      res.status(200).json({ message: 'Joined room', history });
    } catch (error) {
      res.status(500).json({ message: 'Error joining room', error });
    }
  }
}
