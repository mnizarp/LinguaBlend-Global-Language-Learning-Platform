import { useNavigate } from "react-router-dom"
import useTimeDiff from "../../CustomHooks/useTimeDiff"

interface NotificationProps{
  notification:{
    type:string
    sender_id:{
      _id:string
      name:string
      photo:{
        url:string
      }
    }
   createdAt:Date
  }
}

const Notification=({notification}:NotificationProps)=> {

  const navigate=useNavigate()

  return (
    <div className="w-full h-16 flex items-center justify-between px-2 bg-slate-50 rounded-md">
    <div className="flex space-x-2 items-center ">
        <img onClick={()=> navigate('/profilepage',{ state: { user:notification?.sender_id?._id } })} className="rounded-full cursor-pointer w-10 h-10" src={notification?.sender_id?.photo?.url} alt=""/>  
        
            <div className="flex items-center space-x-1 md:space-x-2 ">
                <h1 className=" text-xs md:text-md font-semibold">{notification?.sender_id?.name} </h1>   
                {
                notification?.type == 'Follow' &&
                <h1 className="text-xs md:text-md" >started following you</h1>                   
                }
                {
                notification?.type == 'Like' &&
                <h1 className="text-xs md:text-md" >Liked your post</h1>  
                }   
            </div>
    </div>
    <p className="text-xs" >{useTimeDiff(notification?.createdAt)}</p>
 </div>
  )
}

export default Notification