import express from 'express';
import Room from '../models/ChatRoom.js';

const router = express.Router();

router.post('/create', async (req, res) => {
  const { password } = req.body;

  try {
    const existingRoom = await Room.findOne({ password });
    if (existingRoom) {
      return res.status(400).json({ message: 'Sala já existe!' });
    }

    const newRoom = new Room({ password });
    await newRoom.save();

    res.status(201).json({ message: 'Sala criada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar sala!', error: err });
  }
});

export default router;
