import { useLogoutMutation } from "../../slices/usersApiSlice"
import { logout } from "../../slices/authSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

interface HeadMobileProps{
   pagename:string
}

const HeadMobile:React.FC<HeadMobileProps>=(props)=>{
    const dispatch=useDispatch()
    const navigate=useNavigate()
      const [logoutApiCall]=useLogoutMutation()
    
      const logoutHandler=async()=>{
        try{
           await logoutApiCall({}).unwrap()
           dispatch(logout())
           navigate('/')
        }catch(error){
           console.log(error)
        }
      }
    return(
 
      <div className=" w-screen h-full border-b-2 bg-white  flex  justify-between p-2">
         <div className="flex w-1/2 items-center h-full">
            <img className="w-[20%] h-[60%]" src="/assets/lb-removebg-previewhh.png" alt=""/>
            <img className="w-[70%] h-[55%]" src="/assets/lb-removebg-preview.png" alt=""/>
         </div>
         {
            props.pagename == 'Home'||props.pagename =='Sessions'||props.pagename =='Chats'||props.pagename =='Notifications'||props.pagename =='Profile' ?
           <img onClick={logoutHandler} className="w-6 h-6 self-center cursor-pointer float-right" src="/assets/icons/icons8-logout-50.png" alt=""/>
            : null
         }
         
        </div>
       
    )
}
export default HeadMobile