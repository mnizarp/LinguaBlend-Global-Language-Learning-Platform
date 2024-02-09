import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { useClearOtpMutation, useResendOtpMutation } from '../../slices/usersApiSlice';

interface MyTimerProps{
  expiryTimestamp:any
  userEmail:string
  
}

const MyTimer:React.FC<MyTimerProps>=({ expiryTimestamp ,userEmail})=> {
 
    // const {userInfo}=useSelector((state:RootState)=>state.auth)

    const [running,setRunning]=useState(true)
    const [clearOtp]=useClearOtpMutation()

    const {
    
    seconds,
    minutes,
    restart
  } = useTimer({ expiryTimestamp, onExpire: () => {
    setRunning(false)
    clearOtp({userEmail})
    
  } });
   
   const [resendOtp]=useResendOtpMutation()

   

   const handleResendOtp=async ()=>{
    try {
       
        resendOtp({userEmail})
        const time = new Date();
        time.setSeconds(time.getSeconds() + 60);
        restart(time,true)
        setRunning(true)
    } catch (error) {
        console.log(error)
    }
   } 

  return (
    <>
    {
        running ? 
        
        <div style={{textAlign: 'center'}}>    
            <div style={{fontSize: '30px'}}>
            <span>{minutes}</span>:<span>{seconds}</span>
            </div>    
        </div>
        
      :
     <button onClick={handleResendOtp} className='border-2  bg-red-500 mb-1  text-white h-7 text-xs p-1 w-max bg-opacity-60 rounded-lg
     md:h-8 md:text-sm' >Resend Otp</button>
    }
   </>
  );
}

export default MyTimer