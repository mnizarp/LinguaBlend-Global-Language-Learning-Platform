import express,{Application} from 'express'
import http from 'http'
import {Server as SocketIoServer} from 'socket.io'
import dotenv from 'dotenv'
import connectDb from './config/connectDb'
import userRouter from './routes/userRoutes'
import adminRouter from './routes/adminRoutes'
import cors from 'cors'
import path from 'path'
import { errorHandler, notFound } from './middlewares/errorMiddlewares'
import { chatRouter } from './routes/chatRoutes'
import { sessionRouter } from './routes/sessionRoutes'

dotenv.config()
const corsOptions = {
    origin: process.env.CLIENT_PORT, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials:true 
  };

const app:Application=express()
const server=http.createServer(app)
const io=new SocketIoServer(server,{
  pingTimeout:60000,
  cors:{
    origin:process.env.CLIENT_PORT
  }
})

dotenv.config()
app.use(cors(corsOptions))
app.use(express.json({limit:'15mb'}))
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')));
connectDb()
   

app.use('/api/users/',userRouter)
app.use('/api/chats/',chatRouter)
app.use('/api/admin/',adminRouter)
app.use('/api/session/',sessionRouter)
app.use(notFound)
app.use(errorHandler)
const port=process.env.PORT || 9009
server.listen(port,()=>{
    console.log(`server connected on port = ${port}`)
})

io.on('connection',(socket)=>{
  

  socket.on('setup',(userData)=>{ 
    socket.join(userData?._id)
    socket.emit('connected')
  })     

  socket.on('join chat',(room)=>{
   socket.join(room)
  }) 

  socket.on('leave chat', (room) => {
    socket.leave(room);
  });

  socket.on('typing',(room)=>socket.in(room).emit('typing'))
  socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'))

  socket.on('new message',(newMessageRecieved)=>{
    let chat=newMessageRecieved?.message?.chat_id
    if(!chat?.users) return console.log('chatusers not defined')
    chat?.users?.forEach((user:any)=>{
      if(user==newMessageRecieved.message.sender_id) return;
        socket.in(user).emit('message recieved',newMessageRecieved)
    })
  })

  socket.on('join session',(room)=>{
    socket.join(room)
   })

   socket.on('leave session', (room) => {
    socket.leave(room);
  });

  socket.on('quit session', (room) => {
    socket.leave(room);
  });

  socket.on('close session',(room)=>{
    io.to(room).emit('quit session',room);
  })
 
  

  socket.on('new sessionmessage',(newMessageRecieved)=>{
    let session=newMessageRecieved?.session_id
    if(!session?.members) return console.log('session members not defined')
    session?.members?.forEach((member:any)=>{
        socket.in(member).emit('sessionmessage recieved',newMessageRecieved)
    })
    socket.in(session.host).emit('sessionmessage recieved',newMessageRecieved)
  })


  socket.on('new notification',(newNotificationRecieved)=>{
    let userId=newNotificationRecieved?.user_id

    socket.in(userId).emit('notification recieved',newNotificationRecieved)
  })



})       

