import express from 'express';
import ChatController from '../controllers/chatController.js';

const router = express.Router();

router.post('/join', ChatController.joinRoom);

export default router;
