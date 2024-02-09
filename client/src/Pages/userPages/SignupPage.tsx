import { useDispatch, useSelector } from "react-redux"
import SignupForm from "../../Components/user/SignupForm"
import { useNavigate } from "react-router-dom"
import { setCredentials } from "../../slices/authSlice"
import { ChangeEvent, useEffect, useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { BASE_URL } from "../../constants"
import { RootState } from "../../store/rootReducer"
import MyTimer from "../../Components/user/MyTimer"

const SignupPage:React.FC=()=>{

    const {userInfo}=useSelector((state:RootState)=>state.auth)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    useEffect(()=>{
      if(userInfo){
        if(userInfo.isProfileFinished===true){
          navigate('/home')
        }else{
          navigate('/finishprofilepage')
        }
      }
    },[navigate,userInfo])
    
    const [n1,setN1]=useState('')
    const handleN1=(e: ChangeEvent<HTMLInputElement>)=>{
      const inputValue = e.target.value;
      if (/^\d*$/.test(inputValue) || inputValue==='') {
        setN1(inputValue);
      }
    }

    const [n2,setN2]=useState('')
    const handleN2=(e: ChangeEvent<HTMLInputElement>)=>{
      const inputValue = e.target.value;
      if (/^\d*$/.test(inputValue) || inputValue==='') {
        setN2(inputValue);
      }
    }

    const [n3,setN3]=useState('')
    const handleN3=(e: ChangeEvent<HTMLInputElement>)=>{
      const inputValue = e.target.value;
      if (/^\d*$/.test(inputValue) || inputValue==='') {
        setN3(inputValue);
      }
    }

    const [n4,setN4]=useState('')
    const handleN4=(e: ChangeEvent<HTMLInputElement>)=>{
      const inputValue = e.target.value;
      if (/^\d*$/.test(inputValue) || inputValue==='') {
        setN4(inputValue);
      }
    }

    const [email,setEmail]=useState('')
    const [verifyPending,setVerifyPending]=useState(false)
    const handleVerify=async()=>{
      try{
        console.log(n1+n2+n3+n4)
        const response=await axios.post(`${BASE_URL}users/verifyotp`,{
          email,
          otp:n1+n2+n3+n4
        })
         dispatch(setCredentials({...response.data}))
         navigate('/finishprofilepage')
      }catch(error){
        const apiError = error as  {response:{ status?: number} } ;
        if(apiError?.response.status==402){
          toast.error('Incorrect Otp')
        }else if(apiError?.response.status==403){
          toast.error('Otp not found')
        }else{
          toast.error('an error occurred')
        }  
      }
    }

    const time = new Date();
  time.setSeconds(time.getSeconds() + 60);

    return(
        <div className="bg-sky-600 grid  place-items-center w-full h-screen p-2" >
            <div className="bg-sky-700 w-[90%]  h-[90%] rounded-lg container flex flex-col justify-center items-center space-y-10
                             md:w-[60%] ">
                <h1 className="text-white text-3xl  font-mono font-extrabold 
                               md:text-5xl">
                 Register
                </h1>
                <SignupForm setVerifyPending={setVerifyPending} setEmail={setEmail} />
                {
                  verifyPending &&
                      <div className="flex flex-col items-center">
                        <p className="text-white text-xs md:text-sm">Enter the otp to verify your email</p>
                      <div className="p-2  h-10 w-max  space-x-1  flex  items-center md:h-12">
                              <input onChange={handleN1} maxLength={1} className="w-8 h-full bg-opacity-40 rounded-sm bg-slate-100 border border-white p-2"  value={n1} />
                              <input onChange={handleN2} maxLength={1} className="w-8 h-full bg-opacity-40 rounded-sm bg-slate-100 border border-white p-2"  value={n2} />
                              <input onChange={handleN3} maxLength={1} className="w-8 h-full bg-opacity-40 rounded-sm bg-slate-100 border border-white p-2"  value={n3} />
                              <input onChange={handleN4} maxLength={1} className="w-8 h-full bg-opacity-40 rounded-sm bg-slate-100 border border-white p-2"  value={n4} />
                      </div>
                      <MyTimer expiryTimestamp={time} userEmail={email} /> 
                      <button onClick={handleVerify} className="border-2  bg-emerald-300  text-white h-7 text-xs p-1 w-max bg-opacity-60 rounded-lg
                                          md:h-8 md:text-sm">Verify</button>
                                                                           
                      </div>
                }
                
            </div>
        </div>
    )
}
export default SignupPage