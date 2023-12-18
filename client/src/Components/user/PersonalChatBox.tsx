import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../../Animations/lottie_typing.json'
import { RootState } from "../../store/rootReducer"
import { Socket } from 'socket.io-client';
import { ENDPOINT } from "../../constants"
import { useGetUserDetailsMutation } from "../../slices/usersApiSlice"
import { useClearUnreadMessagesMutation, useGetMessagesMutation, useSendMessageMutation } from "../../slices/chatsApiSlice"
let socket:Socket,selectedChatCompare:string ;
 
interface PersonalChatBoxProps{
    chatBox:string,
    setChatBox:React.Dispatch<React.SetStateAction<string>>
}

interface User {
    photo: {
        url:string
    }
    name: string;
  }
  
  

const PersonalChatBox:React.FC<PersonalChatBoxProps>=({chatBox,setChatBox})=>{

    const {userInfo}=useSelector((state:RootState)=>state.auth)
    const [user, setUser] = useState<User | null>(null);
    const [message,setMessage]=useState('')
    const [allMessages, setAllMessages] = useState<{ sender_id:string,content:string,createdAt:Date }[]>([]);

    const [socketConnected, setsocketConnected] = useState(false)
    const [selectChat,setSelectChat]=useState()

    const [typing,setTyping]=useState(false)
    const [isTyping,setIsTyping]=useState(false)

    const defaultOptions={
        loop:true,
        autoplay:true,
        animationData:animationData,
        rendererSettings:{
            preserveAspectRatio:'xMidYMid slice'
        }
    }
     
    const [getUserDetails]=useGetUserDetailsMutation()

    const getUserAllDetails=useCallback(async()=>{
        try {
            const token=userInfo?.token
            const response=await getUserDetails({token,userId:chatBox}).unwrap()
            setUser(response[0])
        } catch (error) {
            console.log(error)
        }
    },[chatBox,userInfo?.token,getUserDetails])

    useEffect(()=>{
        socket=io(ENDPOINT)
        socket.emit('setup',userInfo)
        socket.on('connected',()=>setsocketConnected(true))
        socket.on('typing',()=>setIsTyping(true))
        socket.on('stop typing',()=>setIsTyping(false))
    },[userInfo])

    const [clearUnreadMessages]=useClearUnreadMessagesMutation()
   
    const clearAllUnreadMessages=useCallback(async()=>{
      try {
        const token=userInfo?.token
        await clearUnreadMessages({token,datas:{chatId:selectChat}})
      } catch (error) {
        console.log(error)
      }
    },[clearUnreadMessages,userInfo,selectChat])

    const [getMessages]=useGetMessagesMutation()

    const getAllMessages=useCallback(async()=>{
        try{
           const token=userInfo?.token
           const response=await getMessages({token,secondUserId:chatBox}).unwrap()
           const {allmessages,chatId}=response
            setAllMessages(allmessages);
            socket.emit('join chat',chatId)
            setSelectChat(chatId) 
            selectedChatCompare=chatId  
        }catch(error){
            console.log(error)
        }
    },[chatBox,userInfo?.token,getMessages])


    useEffect(()=>{
        if (selectChat) {
            socket.emit('leave chat',selectChat);
          }
      getUserAllDetails()
      getAllMessages()
      
      if(selectChat)
      selectedChatCompare=selectChat
      clearAllUnreadMessages()
    },[chatBox,getAllMessages,getUserAllDetails,selectChat,clearAllUnreadMessages])

    interface NewMessageRecieved{
        message:{
            chat_id:{
                _id:string
            }
        }
    }

    useEffect(()=>{
        socket.on('message recieved',(newMessageRecieved:NewMessageRecieved)=>{
            if(
                 selectedChatCompare !== newMessageRecieved.message.chat_id._id
            ){
               console.log('not')
            }else{      
            
                setAllMessages((prevMessages) => [newMessageRecieved?.message, ...prevMessages] as { sender_id:string,content:string,createdAt:Date }[]);

                
            }
        })

        return () => {
            socket.off('message recieved');
          };
    })

  const [sendMessage]=useSendMessageMutation()

    const handleSendMessage=async()=>{
        try{
            setTyping(false)
            socket.emit('stop typing',selectChat)
           const token=userInfo?.token
           const response=await sendMessage({token,datas:{recieverId:chatBox,message}}).unwrap()
           socket.emit('new message',response)
           const fullMessages=[...allMessages]
           fullMessages?.unshift(response?.message)
           setAllMessages(fullMessages)
           setMessage('')
        }catch(error){
            console.log(error)
        }
    }

    const typingHandler=(e:{target:{value:string}})=>{
        setMessage(e.target.value)
        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit('typing',selectChat);
        }

        // const lastTypingTime=new Date().getTime()
        // const timerLength=3000
        // setTimeout(()=>{
        //     const timeNow=new Date().getTime()
        //     const timeDiff=timeNow-lastTypingTime
        //     if(timeDiff>=timerLength && typing){
        //         socket.emit('stop typing',selectChat)
        //         setTyping(false)
        //     }
        // },timerLength)
        if(e.target.value==''){
            setTyping(false)
            socket.emit('stop typing',selectChat)           
        }
    }

    return(
        <div className='border rounded-xl w-full h-full '>
           <div className="w-full h-[10%] rounded-tl-xl rounded-tr-xl bg-emerald-500 flex items-center p-2">
                <div className="w-[50%] h-full flex items-center space-x-3">
                    <img onClick={()=>{
                        socket.emit('leave chat',selectChat);
                        setChatBox('')
                        }} className="w-8 h-8 " src="/assets/icons/icons8-back-64.png" alt=""/>
                   <img className="w-10 h-10 rounded-full" src={`${user?.photo?.url}`} alt=""/>
                   <h1 className="text-md md:text-lg font-semibold text-white ">{user?.name}</h1>
                </div>
           </div>
           <div className="w-full h-[80%] space-y-1 p-1 flex flex-col-reverse overflow-y-scroll ">
           {isTyping && (
                <div className="w-max p-2 rounded-md bg-slate-200">
                <Lottie width={50}
                  options={defaultOptions} />
                </div>
            )} 
            {
                allMessages?.map((message:{sender_id:string,content:string,createdAt:Date})=>(
                    message?.sender_id==userInfo?._id ? 
                    <div className="w-max p-2 self-end rounded-md bg-emerald-100">
                    <h1>{message?.content}</h1>
                    <p style={{ fontSize: '0.6rem' }} className="float-right" >{message?.createdAt && new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true, })}</p>
                    </div>
                    :
                    <div className="w-max p-2 rounded-md bg-slate-200">
                    <h1>{message?.content}</h1>
                    <p style={{ fontSize: '0.6rem' }} className="float-right" >{message?.createdAt && new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true, })}</p>
                    </div>
                ))
            }
                    
           </div>
           <div className="w-full h-[10%] rounded-bl-xl border-t  rounded-br-xl flex items-center p-2 justify-between">
              <input onChange={typingHandler} value={message} className="h-full w-[90%] focus:outline-none " placeholder="Type here..." />
              <div className="h-full w-[10%] flex justify-center items-center">
                <img onClick={handleSendMessage} className="w-8 h-8" src="/assets/icons/icons8-send-letter-50.png" alt=""/>
              </div>
           </div>
        </div>
    )
}
export default PersonalChatBox