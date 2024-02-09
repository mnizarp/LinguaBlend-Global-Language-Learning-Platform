
import React,{useCallback, useEffect,useState} from "react"
import LoginForm from "../../Components/user/LoginForm"
import { useNavigate } from "react-router-dom"
import { useSelector,useDispatch } from "react-redux"
import { setCredentials } from "../../slices/authSlice"
import { useAuth0 } from '@auth0/auth0-react'
import { RootState } from "../../store/rootReducer"
import { logout } from "../../slices/authSlice"
import { useSignupWithGoogleMutation } from "../../slices/usersApiSlice"
import toast from "react-hot-toast"
import ContactAdminForm from "../../Components/user/ContactAdminForm"

const LoginPage: React.FC =()=>{

  const {userInfo}=useSelector((state:RootState)=>state.auth)
  const navigate=useNavigate()
  const [contactAdminOpen,setContactAdminOpen]=useState(false)
  // const {loginWithRedirect,user,isAuthenticated}=useAuth0()
  const { loginWithPopup, user, isAuthenticated } = useAuth0();

  const dispatch=useDispatch()

  interface GoogleUser{
    name:string,
    email:string
  }

  const [signupWithGoogle]=useSignupWithGoogleMutation()
  const googleSignin=useCallback(async(user:GoogleUser|undefined)=>{
    try{
      const response=await signupWithGoogle({ name:user?.name, email:user?.email }).unwrap()
      dispatch(setCredentials({...response}))
      navigate('/finishprofilepage')
    }catch (error: unknown) {
      if ((error as { status?: number })?.status === 403) {
        
        toast.error('Account is blocked by Admin');
        setContactAdminOpen(true)
      }
      console.log(error);
    }
  },[dispatch,navigate,signupWithGoogle])

  useEffect(()=>{
    if(userInfo){
      if(userInfo.isGoogleLogin==true && !user && !isAuthenticated){ 
        dispatch(logout())
        navigate('/')
      }
      else if(userInfo.isProfileFinished===true){
        navigate('/home')
      } else{
        navigate('/finishprofilepage')
      }
      
    }else{
      if(user && isAuthenticated ){
         googleSignin({
          name: user.name as string,
          email: user.email as string,
        });
      }
    }
  },[navigate,userInfo,isAuthenticated,googleSignin,user,dispatch])



  const handleSignupClick=()=>{
     navigate('/signup')
  }


  const handleLoginWithGoogle = async () => {
    try {

       await loginWithPopup()

  
    } catch (error) {
      console.log(error);
    }
  };
 





  
    return (
    
        <div className="bg-sky-600 grid  place-items-center w-full h-screen p-2" >
                           
          <div className="bg-sky-700 w-full h-[95%] items-center  rounded-lg container flex flex-col justify-between space-y-3 md:space-y-5
                           md:flex-row md:p-8 md:w-[70%] md:h-[80%] ">
                            
            <div className="md:container h-[50%]  w-full flex flex-col justify-center items-center space-y-6 md:space-y-2 
                             md:h-[90%] md:w-[90%] ">
                               {
                              contactAdminOpen && <ContactAdminForm  setContactAdminOpen={setContactAdminOpen} />
                              
                            }
                <img className="w-full " src="/assets/Group 2.png" alt=""/>
                <LoginForm setContactAdminOpen={setContactAdminOpen} />
                <div onClick={handleLoginWithGoogle} className="p-2 border border-2-white cursor-pointer  my-2 h-7 w-max rounded-3xl bg-sky-200  flex items-center">
                  <img className="h-5 w-5" src="/assets/icons/icons8-google-48.png" alt=""/>
                  <h6 className="text-black font-medium text-sm  ml-3">Sign in with Google</h6>
                </div>
                <div className="flex mt-4 items-center flex-row space-x-1 ">
                  <p className="text-white text-xs">If you don't have an account </p>
                  <div onClick={handleSignupClick} className="bg-red-500 bg-opacity-90 cursor-pointer w-max h-5 px-2 py-[2px] rounded-md   md:ml-2">
                    <h4 className="text-white text-xs text-center">Signup</h4>
                  </div>
                </div>
            </div>
            <div className="  w-full h-[40%]  md:w-[90%] md:h-[90%] md:ml-3 flex justify-center items-center">
                <img className=" w-full h-[90%]  md:w-full rounded-xl opacity-90 "  src="/assets/login page image.jpg" alt=""/>
            </div>
          </div>
        </div>
    )
}

export default LoginPage