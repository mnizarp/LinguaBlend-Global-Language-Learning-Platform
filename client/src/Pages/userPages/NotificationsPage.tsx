import  { useCallback, useEffect, useState } from 'react'
import HeadMobile from '../../Components/user/HeadMoblile'
import MenuBar from '../../Components/user/MenuBar'
import FootMobile from '../../Components/user/FootMobile'
import {  useSelector } from 'react-redux'
import Suggestion from '../../Components/user/Suggestion'
import Notification from '../../Components/user/Notification'
import { RootState } from '../../store/rootReducer'
import { useClearAllUnreadNotificationsMutation, useGetAllNotificationsMutation, useGetAllSuggestionsMutation } from '../../slices/usersApiSlice'


const NotificationsPage = () => {
    const {userInfo}=useSelector((state:RootState)=>state.auth)
    
    const [allnotifications,setAllnotifications]=useState([])
    const [allsuggestions,setAllsuggestions]=useState([])

    const [getAllSuggestions]=useGetAllSuggestionsMutation()
    const getSuggestions=useCallback(async()=>{
      try {
         const token=userInfo?.token
         const response=await getAllSuggestions({token}).unwrap()
         setAllsuggestions(response.allsuggestions)
      } catch (error) {
         console.log(error)
      }
 },[userInfo?.token,getAllSuggestions])

   const [getAllNotifications]=useGetAllNotificationsMutation()
    const getNotifications=useCallback(async()=>{
      try{
        const token=userInfo?.token
        const response=await getAllNotifications({token}).unwrap()
        setAllnotifications(response.notifications)
      }catch(error){
          console.log(error)
      }
  },[userInfo?.token,getAllNotifications])

    const [clearAllUnreadNotifications]=useClearAllUnreadNotificationsMutation()
    const clearUnreadNotifications=useCallback(async()=>{
      try{
          const token=userInfo?.token
          await clearAllUnreadNotifications({token})
      }catch(error){
          console.log(error)
      }
  },[userInfo?.token,clearAllUnreadNotifications])

    useEffect(()=>{
        getNotifications()
        getSuggestions()
        clearUnreadNotifications()
    },[getNotifications,getSuggestions,clearUnreadNotifications])

  
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row">
      <div className="w-screen h-[8%] md:hidden">
        <HeadMobile pagename="Notifications" />
      </div>
      <div className="hidden md:block md:w-[18%] md:h-screen">
        <MenuBar pagename="Notifications" />
      </div>
  
      <div className="flex h-full items-center w-full md:w-[82%] py-[8%] px-[5%] md:p-5">
        <div className="w-full md:w-[60%] h-full flex flex-col items-center space-y-2 overflow-y-scroll">
          {allnotifications?.map((notification) => (
            <Notification  notification={notification} />
          ))}
          {allnotifications?.length === 0 && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-lg font-semibold text-gray-500">No notifications yet.</p>
            </div>
          )}
        </div>
  
        <div className="hidden md:block md:w-[40%] md:h-full md:space-y-2 md:p-2">
          <h1 className="text-xl font-bold">Suggestions</h1>
          <div className="md:w-full md:h-full md:space-y-2 md:overflow-y-scroll">
            {allsuggestions?.map((suggestion) => (
              <Suggestion  suggestion={suggestion} />
            ))}
          </div>
        </div>
      </div>
  
      <div className="w-screen h-[8%] md:hidden">
        <FootMobile pagename="Notifications" />
      </div>
      <style>
        {`
          ::-webkit-scrollbar {
            width: 8px;
          }
  
          ::-webkit-scrollbar-thumb {
            background-color: #cccccc;
            border-radius: 6px;
          }
  
          ::-webkit-scrollbar-track {
            background-color: #f1f1f1;
          }
        `}
      </style>
    </div>
  )
  
}

export default NotificationsPage