import { useCallback, useEffect, useState } from "react";

const useTimeDiff=(createdAt:string|Date)=>{
    const [timeDifference,setTimeDifference]=useState('')

  const getTimeDifference=useCallback(()=>{
    const createdTime:Date = new Date(createdAt);
    const currentTime:Date = new Date();
  const timeDiffInMinutes = Math.floor((currentTime.getTime() - createdTime.getTime()) / (1000 * 60)); 
  if (timeDiffInMinutes < 60) {
    if(timeDiffInMinutes<1){
      setTimeDifference(`Just now`);
    }else if(timeDiffInMinutes==1){
      setTimeDifference(`1 minute ago`);
    }else{
      setTimeDifference(`${timeDiffInMinutes} minutes ago`);
    }
  } else if (timeDiffInMinutes >= 60 && timeDiffInMinutes < 1440) {
    const timeDiffInHours = Math.floor(timeDiffInMinutes / 60);
    if(timeDiffInHours==1){
      setTimeDifference(`1 hour ago`);
    }else{
      setTimeDifference(`${timeDiffInHours} hours ago`);
    }     
  } else {
    const timeDiffInDays = Math.floor(timeDiffInMinutes / 1440);
    if(timeDiffInDays==1){
      setTimeDifference(`1 day ago`);
    }else{
      setTimeDifference(`${timeDiffInDays} days ago`);
    }
  }
  },[createdAt])

  useEffect(()=>{
    getTimeDifference()
  },[createdAt, getTimeDifference])

  return timeDifference
}

export default useTimeDiff