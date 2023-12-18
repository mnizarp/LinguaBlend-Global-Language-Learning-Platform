import express from 'express'
import { protect } from '../middlewares/authMiddleware'
import { create_session, delete_session, getSessionMembers, getSessionMessages, get_allsessions, join_session, leave_session, sendSessionMessage } from '../controllers/userControllers/sessionControllers'

export const sessionRouter=express()

sessionRouter.post('/createsession',protect,create_session)
sessionRouter.get('/getsessions',protect,get_allsessions)
sessionRouter.delete('/deletesession',protect,delete_session)
sessionRouter.patch('/joinsession',protect,join_session)
sessionRouter.patch('/leavesession',protect,leave_session)
sessionRouter.post('/sendsessionmessage',protect,sendSessionMessage)
sessionRouter.post('/getsessionmessages',protect,getSessionMessages)
sessionRouter.post('/getsessionmembers',protect,getSessionMembers)