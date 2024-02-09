
import { useDispatch, useSelector } from 'react-redux'
import {  ENDPOINT,  ZEGO_APPID, ZEGO_SERVER_SECRET } from '../../constants'
import { quitSession } from '../../slices/sessionSlice';
import { useCallback, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client'
import { RootState } from '../../store/rootReducer';
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import { useDeleteSessionMutation, useGetAllSessionMessagesMutation,  useLeaveSessionMutation, useSendSessionMessageMutation } from '../../slices/sessionApiSlice';
let socket:Socket;

import { useAuth0 } from "@auth0/auth0-react"
import { ExtraArgumentType } from "../../thunks/userThunks";
import { AnyAction } from "@reduxjs/toolkit";
import { checkBlockStatus } from "../../thunks/userThunks"
import { ThunkDispatch } from 'redux-thunk';
import { useNavigate } from 'react-router-dom'

interface SessionBoxProps{
   setSessionBoxOpen:React.Dispatch<React.SetStateAction<boolean>>
}

const SessionBox=({setSessionBoxOpen}:SessionBoxProps)=> {

   const {userInfo}=useSelector((state:RootState)=>state.auth)
   const {sessionInfo}=useSelector((state:RootState)=>state.session)
   const dispatchThunk = useDispatch<ThunkDispatch<RootState, ExtraArgumentType, AnyAction>>();

   const dispatch=useDispatch()
 
   const [, setsocketConnected] = useState(false)

   const [deleteSession]=useDeleteSessionMutation()
   const [leaveSession]=useLeaveSessionMutation()

   const sessionBoxClose=async()=>{
      try{
         if(sessionInfo?.host == userInfo?._id){
            socket.emit('close session',sessionInfo?._id);
            setSessionBoxOpen(false)
            dispatch(quitSession())
            const token=userInfo?.token
           const response= await deleteSession({token})
           console.log(response)
         }else{
            socket.emit('leave session',sessionInfo?._id);
            setSessionBoxOpen(false)
            dispatch(quitSession())
            const token=userInfo?.token
            await leaveSession({token,datas:{sessionId:sessionInfo?._id}})
         }
      }catch(error){
         console.log(error)
      }   
   }


   useEffect(()=>{

      socket=io(ENDPOINT)
      socket.emit('setup',userInfo)
      socket.on('connected',()=>setsocketConnected(true))

      return () => {
         socket.off('connected');
         if (socket.connected) {
           socket.disconnect();
         }
       };
  },[userInfo])



   const [message,setMessage]=useState('')

   interface Message{
      sender_id:{
         _id:string
         photo:{
            url:string
         }
      }
      content:string
      createdAt:Date
   }

   const [allMessages,setAllMessages]=useState<Message[]>([])

   const [sendSessionMessage]=useSendSessionMessageMutation()

   const handleSendMessage=async()=>{
      try{
         console.log('clicked')
        const token=userInfo?.token
        const response=await sendSessionMessage({token,datas:{ sessionId:sessionInfo?._id,message }}).unwrap()
        console.log(response?.sessionmessage)
        socket.emit('new sessionmessage',response?.sessionmessage)
        const fullMessages=[...allMessages]
           fullMessages?.unshift(response?.sessionmessage)
           setAllMessages(fullMessages)
        setMessage('')
      }catch(error){
         console.log(error)
      }
   }

   const [getAllSessionMessages]=useGetAllSessionMessagesMutation()

   const getSessionMessages=useCallback(async()=>{
      try {
         const token=userInfo?.token 
         const response=await getAllSessionMessages({ token,datas:{sessionId:sessionInfo?._id }}).unwrap()
         setAllMessages(response?.sessionmessages)
         socket.emit('join session',sessionInfo?._id)
      } catch (error) {
         console.log(error)
      }
   },[sessionInfo,userInfo,getAllSessionMessages])


   useEffect(()=>{
      
      
      socket.on('sessionmessage recieved',(newMessageRecieved)=>{
          if(
               sessionInfo?._id !== newMessageRecieved?.session_id?._id
          ){
             console.log('not')
          }else{      
             
              setAllMessages((prevMessages) => [newMessageRecieved, ...prevMessages]);  
              
          }
      })

      socket.on('quit session', (closedRoom) => {
         if (closedRoom === sessionInfo?._id) {
            setSessionBoxOpen(false)
            dispatch(quitSession())
         }
       });

      return () => {
          socket.off('sessionmessage recieved');
        };
  })
   
  const {logout:auth0Logout}=useAuth0()
  const  navigate=useNavigate()
  useEffect(()=>{
     if(!userInfo){
         navigate('/')
     }else if(userInfo?.isProfileFinished===false){
         navigate('/finishprofilepage')
     }else{
         dispatchThunk(checkBlockStatus(userInfo,userInfo?.token,navigate,auth0Logout))       
     }
   },[auth0Logout, dispatchThunk, navigate, userInfo])

     
   useEffect(()=>{
      if(!sessionInfo){    
         setSessionBoxOpen(false)
      }
      getSessionMessages()
   },[getSessionMessages,sessionInfo,setSessionBoxOpen])

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const myMeeting=async(element: any)=>{
      const appID=ZEGO_APPID
      const serverSecret=ZEGO_SERVER_SECRET
      const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, sessionInfo?._id as string,  Date.now().toString(),userInfo?.name);
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
         container: element,
         scenario: {
           mode: ZegoUIKitPrebuilt.GroupCall, 
         },
         showPreJoinView: false,
         // turnOnCameraWhenJoining: false,
         // showMyCameraToggleButton: false,
         // showAudioVideoSettingsButton: false,
         // showScreenSharingButton: false,
       });
   
   }

  
      
  return (
    <div className=' w-screen h-screen '>
    <div className="w-full h-[10%]   bg-emerald-500 flex items-center p-2 justify-between">
         <div className="w-[50%] h-full flex items-center space-x-3">
            <img className="w-10 h-10 rounded-full" src={`${sessionInfo?.language?.flag}`} alt=""/>
            <h1 className="text-lg font-semibold text-white ">{sessionInfo?.title}</h1>
         </div>
         <img onClick={sessionBoxClose} className='w-8 h-8' src='/assets/icons/icons8-close-48.png' alt='' />
    </div>
    <div className='w-full h-[80%] flex flex-col md:flex-row'>
       <div className="w-full md:w-[50%] h-full  p-5 flex flex-wrap overflow-y-scroll ">
              
        
 
 <div
      className="w-full h-full"
      ref={myMeeting}
      // style={{ width: '100vw', height: '100vh' }}
    ></div>
             
        </div>
        <div className='w-full md:w-[50%] h-full flex flex-col'>
            <div className="w-full h-[90%] space-y-1 p-1 flex flex-col-reverse overflow-y-scroll ">
            {
                allMessages?.map((message:Message)=>(
                    message?.sender_id?._id==userInfo?._id ? 
                    <div className="w-max p-2 self-end rounded-md bg-emerald-100">
                    <h1>{message?.content}</h1>
                    <p style={{ fontSize: '0.6rem' }} className="float-right" >{message?.createdAt && new Date(message?.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true, })}</p>
                    </div>
                    :
                    <div className='flex w-max space-x-1 items-center'>
                     <img className='w-6 h-6 rounded-full' src={`${message?.sender_id?.photo.url}`} alt=''/>
                    <div className="w-max p-2 rounded-md bg-slate-200">
                    <h1>{message?.content}</h1>
                    <p style={{ fontSize: '0.6rem' }} className="float-right" >{message?.createdAt && new Date(message?.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true, })}</p>
                    </div>
                    </div>
                ))
            }               
            </div>
            <div className="w-full h-[8%] md:h-[10%]  border-t  rounded-br-xl flex items-center p-2 justify-between">
            <input onChange={(e)=>setMessage(e.target.value)} value={message} className="h-full w-[90%] focus:outline-none " placeholder="Type here..." />
            <div className="h-full w-[10%] flex justify-center items-center">
            <img onClick={handleSendMessage} className="w-8 h-8" src="/assets/icons/icons8-send-letter-50.png" alt=""/>
            </div>
            </div>
        </div>
       
    </div>
   
    
    <div className="w-full h-[7%] md:h-[10%] rounded-tl-xl rounded-tr-xl bg-emerald-500 flex items-center p-2">
         <div className="w-[50%] h-full flex items-center space-x-3">
          
         </div>
    </div>
 </div>
  )
}


export default SessionBox
















 











