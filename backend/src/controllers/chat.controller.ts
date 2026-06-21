import { Request, Response } from 'express';
import {AsyncHandler} from '../utils/handlers';
import { ApiResponse } from '../@types/type';


// send Message
const sendMessage = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // getting loggedIn user data
});

// get Message By chatId

const getMessagesByChatId = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // getting loggedIn user data
});

// get All Messages of loggedIn user

const getAllMessages = AsyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    // getting loggedIn user data
});

export {  sendMessage, getMessagesByChatId, getAllMessages };