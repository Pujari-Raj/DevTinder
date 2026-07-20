import { Router } from 'express';
import { userAuth } from '../middlewares/auth.middleware';
import { sendMessage, getMessagesByChatId, getUserChats } from '../controllers/chat.controller';

const chatRouter = Router();

chatRouter.post("/send/:receiverId", userAuth, sendMessage);
chatRouter.get("/messages/:chatId", userAuth, getMessagesByChatId);
chatRouter.get("/all", userAuth, getUserChats);

export default chatRouter;