import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../Components/admin/Header"
import { useCallback, useEffect, useState } from "react";
import { PHOTO_BASE_URL } from "../../constants";
import BlockConfirm from "../../Components/admin/BlockConfirm";
import HidePostConfirm from "../../Components/admin/HidePostConfirm";
import { useGetUserDetails_adminMutation, useGetUserPosts_adminMutation } from "../../slices/adminApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";

interface userDetails{
  _id:string,
  name:string,
  photo:{
    url:string
  },
  followers:[],
  following:[],
  email:string,
  country_id:{
    country:string,
    flag:string
  },
  language_id:{
    language:string,
    flag:string
  },
  registered_on:string
}


interface Post{
  post_image:string,
  isHide:boolean,
  likes:[],
  _id:string,
  caption:string
}

const ProfileView:React.FC=()=>{
    const location = useLocation();
    const userId = location?.state?.userId;
    const navigate=useNavigate()
    const [userDetails,setUserDetails]=useState<userDetails>()
    const [userPosts,setUserPosts]=useState<Post[]>([])
    const [userBlocked,setUserBlocked]=useState(false)

    const {adminInfo}=useSelector((state:RootState)=>state.admin)
  useEffect(()=>{
      if(!adminInfo){
         navigate('/admin')
      }
  },[adminInfo,navigate])

    const [getUserDetails_admin]=useGetUserDetails_adminMutation()

    const getUserDetails=useCallback(async()=>{
      try{
       const response=await getUserDetails_admin({token:adminInfo?.token,userId}).unwrap()
          setUserDetails(response.userdetails)
          setUserBlocked(response.userdetails?.isBlocked)
      }catch(error){
          console.log(error)
      }
  },[adminInfo,getUserDetails_admin,userId])
    
    const [getUserPosts_admin]=useGetUserPosts_adminMutation()

    const getUserPosts=useCallback(async()=>{
      try{
       const response=await getUserPosts_admin({token:adminInfo?.token,userId}).unwrap()
          setUserPosts(response.userposts)
      }catch(error){
          console.log(error)
      }
  },[adminInfo,getUserPosts_admin,userId])

    const [blockStatusChange,setBlockStatusChange]=useState('')
    const [showBlockConfirmation,setShowBlockConfirmation]=useState(false)

   
   const handleBlock=()=>{
    setBlockStatusChange('change')  
    setShowBlockConfirmation(true)
   }
      const handleBlockConfirmClose=()=>{
        setShowBlockConfirmation(false)
        setBlockStatusChange('changed')
      }

      const [hidePostId,setHidePostId]=useState<string|undefined>('')
      const [showHideConfirmation,setShowHideConfirmation]=useState(false)
      const [hideStatusChange,setHideStatusChange]=useState('')
      const handleHidePost=(postId:string)=>{
        setHideStatusChange('change')
        setHidePostId(postId)
        setShowHideConfirmation(true)
      }
      const handleHideConfirmClose=()=>{
        setShowHideConfirmation(false)
        setHidePostId(undefined)
        setHideStatusChange('changed')
      }
    useEffect(()=>{
        getUserDetails()     
    },[blockStatusChange,getUserDetails])

    useEffect(()=>{  
        getUserPosts()
    },[hideStatusChange,getUserPosts])


   

    return(
      <div className="h-screen" >
        <Header pagename="Users" />

         {/* full */}
        <div className="w-screen h-[91%] flex">
        {showBlockConfirmation && <BlockConfirm userId={userDetails?._id} setOpen={handleBlockConfirmClose} />}
        {showHideConfirmation && <HidePostConfirm postId={hidePostId} setOpen={handleHideConfirmClose} />}
            {/* profiledetails */}
           <div className="w-[28%] h-full border-r container py-3 px-2 flex flex-col space-y-6">
             <img onClick={()=> navigate('/usermanagement')} className="w-8 h-8 cursor-pointer" src="/assets/icons/icons8-back-64.png" alt=""/>
             <div className="w-full flex flex-col items-center space-y-10">
             <div className="flex flex-col items-center space-y-1">
                <img className="w-40 h-40 rounded-full" src={`${userDetails?.photo.url}`} alt=""/>
                <h1 className="text-xl font-bold" >{userDetails?.name}</h1>
             </div>
             <div className="flex space-x-7" >
                 <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold">{userPosts?.length}</h1>
                    <h1 className="text-md font-semibold">Posts</h1>
                 </div>
                 <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold">{userDetails?.followers.length}</h1>
                    <h1 className="text-md font-semibold">Followers</h1>
                 </div>
                 <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold">{userDetails?.following.length}</h1>
                    <h1 className="text-md font-semibold">Following</h1>
                 </div>
             </div>
             <div className="flex flex-col space-y-3 items-center">
                <div className="flex space-x-1 items-center">
                  <h1 className=" text-md font-semibold" >Email:</h1>
                  <h1 className="text-md font-semibold" >{userDetails?.email}</h1>
                </div>
                <div className="flex space-x-1 items-center">
                  <h1 className=" text-md font-semibold" >Country:</h1>
                  <h1 className="text-md font-semibold" >{userDetails?.country_id.country}</h1>
                  <img className="w-5 h-5" src={`${PHOTO_BASE_URL}${userDetails?.country_id.flag}`} alt=""/>
                </div>
                <div className="flex space-x-1 items-center">
                  <h1 className=" text-md font-semibold" >Language:</h1>
                  <h1 className="text-md font-semibold" >{userDetails?.language_id.language}</h1>
                  <img className="w-5 h-5" src={`${PHOTO_BASE_URL}${userDetails?.language_id.flag}`} alt=""/>
                </div>
                <div className="flex space-x-1 items-center">
                  <h1 className=" text-md font-semibold" >Registered on:</h1>
                  <h1 className="text-md font-semibold" >{userDetails?.registered_on}</h1>
                </div>
             </div>
             {
                userBlocked==true ?
                <button onClick={handleBlock} className="bg-blue-500 rounded-md p-1 w-28 text-white text-sm font-semibold">UnBlock User</button>
                  :
                <button onClick={handleBlock} className="bg-red-500 rounded-md p-1 w-28 text-white text-sm font-semibold">Block User</button>    
             }
             </div>
           </div>

           {/* posts */}
           <div className="w-[44%] h-full space-y-5 container p-2 overflow-y-scroll items-center">
            <h1 className="text-2xl font-bold">Posts</h1>
            {
              userPosts?.length>0 ?
                userPosts?.map((post)=>(
                  <div className="w-full space-y-3 border p-1 rounded-md">
                    <img src={`${post?.post_image}`} alt=""/>
                    <div className="flex justify-between">
                        <h1 className="font-semibold">{post?.likes.length} Likes</h1>
                        {
                            post?.isHide == true ?
                           <button onClick={()=> handleHidePost(post?._id)} className="bg-blue-500 text-xs text-white p-1 rounded-md">UnHide Post</button>
                           :
                           <button onClick={()=> handleHidePost(post?._id)} className="bg-red-500 text-xs text-white p-1 rounded-md">Hide Post</button>
                        }
                        
                    </div>
                    <p>{post?.caption}</p>
                  </div>
                ))
                :
                <div className="w-full space-y-3 border p-1 rounded-md">
                  <h1>No posts available</h1>
                  </div>
            }           
           </div>

           {/* achievements */}
           <div className="w-[28%] h-full border-s">

           </div>

        </div>

      </div>
    )
}
export default ProfileView 