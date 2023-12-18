import HeadMobile from "../../Components/user/HeadMoblile"
import MenuBar from "../../Components/user/MenuBar"
import FootMobile from "../../Components/user/FootMobile"
import {  PHOTO_BASE_URL } from "../../constants"
import { useSelector } from "react-redux"
import ProfilePost from "../../Components/user/ProfilePost"
import { useLocation, useNavigate } from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import { RootState } from "../../store/rootReducer"
import Suggestion from "../../Components/user/Suggestion"
import { useFollowUnfollowMutation, useGetAllSuggestionsMutation, useGetProfilePostsMutation, useGetUserDetailsMutation, useReportUserMutation } from "../../slices/usersApiSlice"
import io from 'socket.io-client'
import { Socket } from 'socket.io-client';
import { ENDPOINT } from "../../constants"
let socket:Socket

const ProfilePage:React.FC=()=>{

    const {userInfo}=useSelector((state:RootState)=>state.auth)

    interface UserDetails{
      _id:string
      name:string
      photo:{
        url:string
      }
      language:{
        language:string
        flag:string
      }
      country:{
        flag:string
      },
      following:[]
      followers:[]
     }

     interface Follower{
      _id:string
      name:string
      photo:{
        url:string
      }
     }
  
     interface Following{
      _id:string
      name:string
      photo:{
        url:string
      }
     }

    const [userId,setUserId]=useState<string|undefined>('')
    const [userDetails,setUserDetails]=useState<UserDetails>()
    const [following,setFollowing]=useState(false)
    const [showFollowers,setShowFollowers]=useState(false)
    const [showFollowings,setShowFollowings]=useState(false)
    const [followings,setFollowings]=useState([])
    const [followers,setFollowers]=useState([])
        const location = useLocation()
        const { state } = location
        const { user } = state

        const [allPosts,setAllPosts]=useState([])
        const navigate=useNavigate()

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

     const [getUserDetails]=useGetUserDetailsMutation()
     const [getProfilePosts]=useGetProfilePostsMutation()
const fetchData =useCallback( async () => {
  try {
     const token=userInfo?.token
     const userDetailsResponse = await getUserDetails({token,userId}).unwrap()
     const allPostsResponse = await getProfilePosts({token,userId}).unwrap()


     setUserDetails(userDetailsResponse[0]);
     setFollowings(userDetailsResponse[0]?.followingDetails)
     setFollowers(userDetailsResponse[0]?.followersDetails)    
      if(userDetailsResponse[0]?.followers?.includes(userInfo?._id)){
       setFollowing(true)
      }else{
       setFollowing(false)
      }

      setAllPosts(allPostsResponse.allposts);
    
  } catch (error) {
    console.log(error);
  }
},[userId,userInfo,getProfilePosts,getUserDetails])

useEffect(()=>{
   if (user === 'Me') {
      setUserId(userInfo?._id  );
  } else {
      setUserId(user );
  }  
},[user,userInfo?._id])


useEffect(()=>{
    if(!userInfo){
        navigate('')
    }else if(userInfo?.isProfileFinished===false){
        navigate('/finishprofilepage')
    }else{
      if (!userId) return;
      setShowFollowers(false)
      setShowFollowings(false)
      fetchData()
      getSuggestions()
    }
},[navigate, userId,following,fetchData,userInfo,getSuggestions])


      const [, setsocketConnected] = useState(false)

      useEffect(()=>{
        socket=io(ENDPOINT)
        socket.emit('setup',userInfo)
        socket.on('connected',()=>setsocketConnected(true))

      },[userInfo])


    const [followUnfollow]=useFollowUnfollowMutation()
   const handleFollow=async()=>{
    try{ 
      const token=userInfo?.token
      const response=await followUnfollow({token,datas:{profileId:userId}}).unwrap()
        setFollowing(response.following)
        if(response.following==true){
          socket.emit('new notification',response?.newnotification)
        }
    }catch(error){
      console.error(error)
    }
   }

   const handleEditProfileButton=async()=>{
    navigate('/editprofilepage')
   }

   const [showReportBox,setShowReportBox]=useState(false)
   const [reportReason,setReportReason]=useState('')

   const handleReportButton=()=>{
        setShowReportBox(true)
   }

   const handleCancelButton=()=>{
    setShowReportBox(false)
   }

   const [reportUser]=useReportUserMutation()
   const handleReportSend=async()=>{
    try{
     const token=userInfo?.token
     await reportUser({token,datas:{reportReason,userId}}).unwrap()
      setShowReportBox(false)
    }catch(error){
      console.log(error)
    }
   }

    return(
        <div className="w-screen  h-screen flex flex-col  md:flex-row ">
                <div className="fixed w-screen h-[8%] top-0 md:hidden">
                <HeadMobile pagename='Profile'/>
                </div> 
                <div className="hidden md:block md:w-[18%] md:h-screen">
                <MenuBar pagename='Profile'/>
                </div>
                <div className=" space-x-3 flex md:w-[82%] py-[17%] md:py-0">
                     {/* details and posts */}
                     <div className="  overflow-y-scroll w-full md:w-[70%] h-full">
                     {/* details part */}
                     <div className="w-full bg-white flex h-48 md:h-[35%] border-b-2 ">
                         {/* dp part */}
                         <div className=" w-[40%] h-full flex flex-col space-y-3 items-center justify-center">
                           {/* name and country */}
                           <div className="flex items-center space-x-1 md:space-x-2">
                           <h1 className="text-sm md:text-lg font-bold">{userDetails?.name} </h1>
                           <img className="w-4 h-4 md:w-6 md:h-6" src={`${PHOTO_BASE_URL}${userDetails?.country?.flag}`} alt="" />
                           </div>
                           {/* profile image */}
                          
                             <img className="w-[50%] h-[40%] md:h-[60%] rounded-full" src={`${userDetails?.photo.url}`} alt=""/>
                           
                            <div className="flex items-center space-x-1 ">
                            <h1 className="text-xs md:text-sm md:font-semibold">{userDetails?.language?.language}</h1>
                            <img className="w-4 h-4 md:w-5 md:h-5" src={`${PHOTO_BASE_URL}${userDetails?.language?.flag}`} alt="" />
                            </div>
                         </div>
                         {/* follow part */}
                         <div className=" w-[60%] h-full flex flex-col space-y-3 md:space-y-5 items-center justify-center">
                           {/* post followers following */}
                             <div className="flex space-x-3 md:space-x-10">
                                <div className="flex flex-col items-center cursor-default">
                                   <h1 className="text-lg md:text-2xl md:font-bold">{allPosts ? allPosts.length : 0}</h1>
                                   <h1 className="text-sm md:text-lg md:font-semibold">Posts</h1>                                     
                                </div>
                                <div onClick={()=>setShowFollowers(true)} className="flex flex-col cursor-pointer items-center">
                                   <h1 className="text-lg md:text-2xl md:font-bold">{userDetails?.followers?.length}</h1>
                                   <h1 className="text-sm md:text-lg md:font-semibold">Followers</h1>                                    
                                </div>
                                <div onClick={()=>setShowFollowings(true)} className="flex flex-col cursor-pointer items-center">
                                   <h1 className="text-lg md:text-2xl md:font-bold">{userDetails?.following?.length}</h1>
                                   <h1 className="text-sm md:text-lg md:font-semibold">Following</h1>
                                </div>
                             </div>
         

{
  showFollowers && (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[25%] h-[50%] bg-white shadow-lg rounded-xl">
      <div className="w-full p-3 h-full border border-gray-300 rounded-xl">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Followers</h1>
          <button onClick={() => setShowFollowers(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold bg-gray-500 hover:bg-gray-600 focus:outline-none">
            X
          </button>
        </div>
        <hr className="my-2" />
        <div className="w-full h-[85%] overflow-y-scroll">
          {followers?.map((follower: Follower) => (
            <div  onClick={()=> navigate('/profilepage',{ state: { user:follower?._id} })}  key={follower?._id} className="w-full h-14 p-2 flex cursor-pointer items-center space-x-3 hover:bg-gray-100 transition duration-300">
              <img className="w-10 h-10 rounded-full" src={`${follower?.photo.url}`} alt="" />
              <h1 className="text-base font-semibold">{follower?.name}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



{
  showFollowings && (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[25%] h-[50%] bg-white shadow-lg rounded-xl">
      <div className="w-full p-3 h-full border border-gray-300 rounded-xl">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Followings</h1>
          <button onClick={() => setShowFollowings(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold bg-gray-500 hover:bg-gray-600 focus:outline-none">
            X
          </button>
        </div>
        <hr className="my-2" />
        <div className="w-full h-[85%] overflow-y-scroll">
          {followings?.map((followinguser: Following) => (
            <div onClick={()=> navigate('/profilepage',{ state: { user:followinguser?._id } })} key={followinguser?._id} className="w-full h-14 p-2 flex cursor-pointer items-center space-x-3 hover:bg-gray-100 transition duration-300">
              <img className="w-10 h-10 rounded-full" src={`${followinguser?.photo.url}`} alt="" />
              <h1 className="text-base font-semibold">{followinguser?.name}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

                            
                             {/* follow/editprofile and report */}
                             
                               {
                                   userDetails?._id ==userInfo?._id ?
                                   <button onClick={handleEditProfileButton} className="bg-slate-300  md:p-2 w-32 h-6 md:h-10 rounded-2xl text-black font-semibold">Edit Profile</button>
                                     :
                                     <div className="flex space-x-3 md:space-x-5">
                                       {
                                         following ?
                                         <button onClick={handleFollow} className="bg-gray-400  md:p-2 w-20 h-6 md:h-10 rounded-2xl text-black font-semibold">UnFollow</button>
                                         :
                                         <button onClick={handleFollow} className="bg-blue-600  md:p-2 w-20 h-6 md:h-10 rounded-2xl text-white font-semibold">Follow</button>
                                       }
                                    
                                     <button onClick={handleReportButton} className="bg-red-600 md:p-2 w-20 h-6 md:h-10 rounded-2xl text-white font-semibold">Report</button>
                                     </div>
                               }
                              {
  showReportBox && 
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute opacity-50 inset-0"></div>
      <div className="w-[40%]  absolute z-50 top-48 end-96 border-2 space-y-2 rounded-md border-black p-3 bg-white">
        <h1 className="font-semibold">Why are you reporting this user?</h1>
        <textarea onChange={(e)=>setReportReason(e.target?.value)} value={reportReason} className="w-full p-2 bg-slate-50 h-[150px] placeholder:text-xs" placeholder="Type the report here.." />
        <div className="flex space-x-2 bg-white">
          <button onClick={handleCancelButton} className="bg-gray-700 text-white text-xs w-16 rounded-md p-1">
            Cancel
          </button>
          <button onClick={handleReportSend} className="bg-blue-700 text-white w-16 text-xs rounded-md p-1">
            Send
          </button>
        </div>
      </div>
    </div>
  
}
                             
                         </div>
                       
                     </div>
                    
                     {/* post part */}
                     <div className=" container space-y-5 md:space-y-10 py-5">
                     {
                      allPosts?.length>0 ?
                       allPosts?.map((post)=>(
                             <ProfilePost post={post} />
                       )    
                       )
                       :
                       <div className="w-full h-full container p-10 border flex flex-col justify-center space-y-5 items-center ">
                       <div className="rounded-full w-40 h-40 border-2 flex items-center justify-center border-black">
                         <img src="/assets/icons/icons8-camera-100.png" alt=""/>
                       </div>
                       <h1 className="text-2xl font-bold">No Posts Yet</h1>
                       </div>
                     }

                     </div>
                   </div>
                   {/* Achievements */}
                   <div className=" md:p-3 hidden md:block md:w-[30%] md:h-full">
                   <h1 className='text-xl  font-bold'>Suggestions</h1>
               <div className='md:w-full md:h-full md:space-y-2 md:overflow-y-scroll'>
                {
                    allsuggestions?.map((suggestion)=>(
                        <Suggestion suggestion={suggestion} />
                    ))
                }           
                </div>  
                   </div>                
                    </div>              
                <div className="fixed w-screen h-[8%] bottom-0 md:hidden">
                <FootMobile pagename='Profile' />
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
export default ProfilePage