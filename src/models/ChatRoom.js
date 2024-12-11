import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  name: String,
  message: String,
  date: Date,
});

const ChatRoomSchema = new mongoose.Schema({
  room: { type: String, required: true },
  password: { type: String, required: true },
  messages: [ChatMessageSchema],
});

export default mongoose.model('ChatRoom', ChatRoomSchema);
