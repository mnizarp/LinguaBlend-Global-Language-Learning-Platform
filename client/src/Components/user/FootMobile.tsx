import { useNavigate } from "react-router-dom"

interface FootMobileProps{
  pagename:string
}

const FootMobile:React.FC<FootMobileProps>=(props)=>{
  const navigate=useNavigate()
    return(

        <div className=" w-screen h-full border-t-2 bg-white flex justify-evenly">
          <div onClick={()=> navigate('/home')} className={` ${props.pagename=='Home' ? 'bg-slate-100' : 'bg-white' }  rounded-xl w-20% h-full p-[2px] flex flex-col items-center justify-center`}>
            <img className="h-6 w-6 self-center" src="/assets/icons/icons8-home-50 (1).png" alt=""/>
            <h1 className="text-xs font-semibold">Home</h1>
          </div>
          <div onClick={()=>navigate('/sessionspage')} className={` ${props.pagename=='Sessions' ? 'bg-slate-100' : 'bg-white' } rounded-xl w-20% h-full p-[2px] flex flex-col items-center justify-center`}>
            <img className="h-6 w-6 self-center" src="/assets/icons/icons8-live-50.png" alt=""/>
            <h1 className="text-xs font-semibold">Sessions</h1>
          </div>
          <div onClick={()=>navigate('/chatspage')} className={` ${props.pagename=='Chats' ? 'bg-slate-100' : 'bg-white' } rounded-xl w-20% h-full p-[2px] flex flex-col items-center justify-center`}>
            <img className="h-6 w-6 self-center" src="/assets/icons/icons8-sms-32.png" alt=""/>
            <h1 className="text-xs font-semibold">Chats</h1>
          </div>
          <div onClick={()=>navigate('/notificationspage')} className={` ${props.pagename=='Notifications' ? 'bg-slate-100' : 'bg-white' } rounded-xl  w-20% h-full p-[2px] flex flex-col items-center justify-center`}>
            <img className="h-6 w-6 self-center" src="/assets/icons/icons8-push-notifications-50.png" alt=""/>
            <h1 className="text-xs font-semibold">Notifications</h1>
          </div>
          <div onClick={()=> navigate('/profilepage',{ state: { user:'Me' } })} className={` ${props.pagename=='Profile' ? 'bg-slate-100' : 'bg-white' } rounded-xl w-20% h-full p-[2px] flex flex-col items-center justify-center`}>
            <img className="h-6 w-6 self-center" src="/assets/icons/icons8-male-user-48.png" alt=""/>
            <h1 className="text-xs font-semibold">Profile</h1>
          </div>
        </div>
    )
}
export default FootMobile