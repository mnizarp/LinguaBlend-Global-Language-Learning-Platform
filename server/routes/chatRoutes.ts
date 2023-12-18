import express from 'express'
import { protect } from '../middlewares/authMiddleware'
import { clear_unread_messages, get_chat_unread_messages, get_chats, get_messages, get_unread_messages, sendMessage } from '../controllers/userControllers/chatControllers'
export const chatRouter=express()

chatRouter.post('/sendmessage',protect,sendMessage)
chatRouter.post('/getmessages',protect,get_messages)
chatRouter.get('/getchats',protect,get_chats)
chatRouter.get('/getunreadmessages',protect,get_unread_messages)
chatRouter.post('/getchatunreadmessages',protect,get_chat_unread_messages)
chatRouter.patch('/clearunreadmessages',protect,clear_unread_messages)