
import { useNavigate } from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import LogoutConfirm from "./LogoutConfirm"
import { useSelector } from "react-redux"
import { RootState } from "../../store/rootReducer"
import { useGetUnreadNotificationsMutation } from "../../slices/usersApiSlice"
import io from 'socket.io-client'
import { Socket } from 'socket.io-client';
import { ENDPOINT } from "../../constants"
import { useGetUnreadMessagesMutation } from "../../slices/chatsApiSlice"
let socket:Socket


interface MenuBarProps{
  pagename:string
}

interface unreadNotify{
  _id:string,
  user_id:string,
  sender_id:string,
  type:string,
  unread:boolean,
  createdAt:Date
}

const MenuBar:React.FC<MenuBarProps>=(props)=>{
  const {userInfo}=useSelector((state:RootState)=>state.auth)
  const [unreadnotifications,setUnreadnotifications]=useState<unreadNotify[]>([])
  const [unreadmessages,setUnreadmessages]=useState([])
  
  const [, setsocketConnected] = useState(false)

const navigate=useNavigate()
 
  const [showLogoutConfirmation, setShowDeleteConfirmation] = useState(false);
  const handleLogoutButton = () => {  
    setShowDeleteConfirmation(true);
  }
   const handleLogoutConfirmClose = () => {
   setShowDeleteConfirmation(false);
 };


 useEffect(()=>{
  socket=io(ENDPOINT)
  socket.emit('setup',userInfo)
  socket.on('connected',()=>setsocketConnected(true))

},[userInfo])


const [getUnreadNotifications]=useGetUnreadNotificationsMutation()
const [getUnreadMessages]=useGetUnreadMessagesMutation()

 const getAllUnreadNotifications=useCallback(async()=>{
  try{
    if(userInfo){
    const token=userInfo?.token
    const response=await getUnreadNotifications({token}).unwrap()
    setUnreadnotifications(response.unreadnotifications)
  }
  }catch(error){
    console.log(error)
  }
 },[userInfo,getUnreadNotifications])

 const getAllUnreadMessages=useCallback(async()=>{
  try{
    if(userInfo){
    const token=userInfo?.token
    const response=await getUnreadMessages({token}).unwrap()
    setUnreadmessages(response.unreadmessages)
  }
  }catch(error){
    console.log(error)
  }
 },[userInfo,getUnreadMessages])

 useEffect(()=>{
  getAllUnreadNotifications()
  getAllUnreadMessages()
 },[getAllUnreadNotifications,getAllUnreadMessages])


 useEffect(()=>{
  socket?.on('notification recieved',(newNotificationRecieved)=>{
      if(
           userInfo?._id !== newNotificationRecieved?.user_id
      ){
         console.log('not')
      }else{      
        setUnreadnotifications((prevUnreadnotifications) => [newNotificationRecieved, ...prevUnreadnotifications] as { _id:string,user_id:string,sender_id:string,type:string,unread:boolean,createdAt:Date }[]);  
          // setAllMessages((prevMessages) => [newMessageRecieved?.message, ...prevMessages] as { sender_id:string,content:string,createdAt:Date }[]);
  
      }
  })

  return () => {
      socket?.off('notification recieved');
    };
})

    return(
      
        <div className="h-screen w-full bg-white border-r-2 flex flex-col">
          <div className="w-full h-[30%] flex flex-col items-center justify-center">
             <img className="w-[30%]" src="/assets/lb-removebg-previewhh.png" alt=""/>
             <img className="w-[70%]" src="/assets/lb-removebg-preview.png" alt=""/>
          </div>
          <div className="w-full h-[50%] space-y-2 flex flex-col items-center justify-center">
            <div onClick={()=>navigate('/home')} className={` ${props.pagename=='Home' ? 'bg-slate-200' : 'bg-white' } hover:bg-slate-200 cursor-pointer h-[13%] w-[90%] border-2 rounded-lg flex items-center space-x-3 px-4`}>
            <img className="h-6 w-6 " src="/assets/icons/icons8-home-50 (1).png" alt=""/>
            <h1 className="text-sm font-semibold">Home</h1>
            </div>
            <div onClick={()=>navigate('/sessionspage')} className={` ${props.pagename=='Sessions' ? 'bg-slate-200' : 'bg-white' } hover:bg-slate-200 cursor-pointer h-[13%] w-[90%] border-2 rounded-lg flex items-center space-x-3 px-4`}>
            <img className="h-6 w-6 " src="/assets/icons/icons8-live-50.png" alt=""/>
            <h1 className="text-sm font-semibold">Sessions</h1>
            </div>
            <div onClick={()=>navigate('/chatspage')} className={` ${props.pagename=='Chats' ? 'bg-slate-200' : 'bg-white' } hover:bg-slate-200 cursor-pointer h-[13%] w-[90%] border-2 rounded-lg flex items-center space-x-3 px-4`}>
            <div className="flex items-center space-x-3">          
            <img className="h-6 w-6 " src="/assets/icons/icons8-sms-32.png" alt=""/>
            <h1 className="text-sm font-semibold">Chats</h1> 
            </div> 
            {
              unreadmessages?.length>0 &&
              <div className="w-4 h-4 rounded-full flex items-center bg-red-500 justify-center">
              <h1 className="font-semibold text-xs text-white">{unreadmessages?.length}</h1>
             </div>
            }      
            </div>
           
            <div onClick={()=>navigate('/notificationspage')} className={` ${props.pagename=='Notifications' ? 'bg-slate-200' : 'bg-white' } hover:bg-slate-200 cursor-pointer h-[13%] w-[90%] border-2 rounded-lg flex items-center justify-between px-4`}>
           <div className="flex items-center space-x-3">
            <img className="h-6 w-6 " src="/assets/icons/icons8-push-notifications-50.png" alt=""/>
            <h1 className="text-sm font-semibold">Notifications</h1>
            </div>
            {
              unreadnotifications?.length>0 &&
              <div className="w-4 h-4 rounded-full flex items-center bg-red-500 justify-center">
              <h1 className="font-semibold text-xs text-white">{unreadnotifications?.length}</h1>
             </div>
            }         
            </div>
            <div onClick={()=> navigate('/profilepage',{ state: { user:'Me' } })} className={` ${props.pagename=='Profile' ? 'bg-slate-200' : 'bg-white' } hover:bg-slate-200 cursor-pointer h-[13%] w-[90%] border-2 rounded-lg flex items-center space-x-3 px-4`}>
            <img className="h-6 w-6 " src="/assets/icons/icons8-male-user-48.png" alt=""/>
            <h1 className="text-sm font-semibold">Profile</h1>
            </div>
            <div onClick={handleLogoutButton} className={` ${props.pagename=='Logout' ? 'bg-slate-200' : 'bg-white' } hover:bg-slate-200 cursor-pointer h-[13%] w-[90%] border-2 rounded-lg flex items-center space-x-3 px-4`}>
            <img className="h-6 w-6 " src="/assets/icons/icons8-logout-50.png" alt=""/>
            <h1 className="text-sm font-semibold">Logout</h1>
            {showLogoutConfirmation && <LogoutConfirm  setOpen={handleLogoutConfirmClose} />}
            </div>
          </div>
          <div className="w-full h-[20%]  border-y-2 flex flex-col items-center justify-center">
              <h1 className="text-xs font-semibold">Contact us:-</h1>
              <h1 className="text-xs font-semibold">www.linguablend.com</h1>
              <h1 className="text-xs font-semibold">linguablendofficial@gmail.com</h1>  
          </div>
        </div>
        
      
        
    )
}

export default MenuBar