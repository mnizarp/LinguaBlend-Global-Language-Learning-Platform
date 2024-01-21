
import { ChangeEvent, useCallback, useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ThunkDispatch } from 'redux-thunk';

import MenuBar from "../../Components/user/MenuBar"
import HeadMobile from "../../Components/user/HeadMoblile"
import FootMobile from "../../Components/user/FootMobile"
import AddPost from "../../Components/user/AddPost"
import Post from "../../Components/user/Post"
import ReactCrop,{Area} from 'react-easy-crop';
import { checkBlockStatus } from "../../thunks/userThunks"
import getCroppedImg from "../../utils/getCroppedImg";
import PostShimmer from "../../Shimmers/PostShimmer"
import { RootState } from "../../store/rootReducer"
import { useGetPostsMutation, useUserSearchMutation } from "../../slices/usersApiSlice"
import { useAuth0 } from "@auth0/auth0-react"
import { ExtraArgumentType } from "../../thunks/userThunks";
import { AnyAction } from "@reduxjs/toolkit";

const HomePage:React.FC=()=>{

  const dispatch = useDispatch<ThunkDispatch<RootState, ExtraArgumentType, AnyAction>>();
  const {userInfo}=useSelector((state:RootState)=>state.auth)
const [allPosts,setAllPosts]=useState([])
const navigate=useNavigate()
// const dispatch=useDispatch()
const [newPostAdded,setNewPostAdded]=useState('')
const [postsLoading,setPostsLoading]=useState(false)
const {logout:auth0Logout}=useAuth0()

useEffect(()=>{
  if(!userInfo){
      navigate('/')
  }else if(userInfo?.isProfileFinished===false){
      navigate('/finishprofilepage')
  }else{
      dispatch(checkBlockStatus(userInfo,userInfo?.token,navigate,auth0Logout))       
  }
},[auth0Logout, dispatch, navigate, userInfo])

const [getPosts]=useGetPostsMutation()
const getposts=useCallback(async()=>{
  try{
    setPostsLoading(true)
      if(userInfo){
          const token=userInfo?.token
          const response=await getPosts({token}).unwrap()
              setAllPosts(response.allposts)  
              setPostsLoading(false)      
      }      
  }catch(error){
      console.log(error)
  }  
},[userInfo,getPosts])



useEffect(()=>{
    getposts()
},[newPostAdded,getposts])

const [users,setUsers]=useState([])
const [searchInput,setSearchInput]=useState('')

const [userSearch]=useUserSearchMutation()
const searchUsers=useCallback(async()=>{
  try{         
       if(userInfo){
          const token=userInfo?.token
          const response=await userSearch({token,searchInput}).unwrap()
          setUsers(response)      
        }       
  }catch(error){
      console.log(error)
  }
},[searchInput,userInfo,userSearch])

const [postImageSettingBox,setPostImageSettingBox]=useState(false)
const [selectedImage,setSelectedImage]=useState('')
const [image,setImage]=useState<undefined|string|unknown>()
const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [croppedArea, setCroppedArea] = useState<Area|null>(null);

const onCropComplete = (_croppedAreaPercentage:Area, croppedAreaPixels:Area) => {
    setCroppedArea(croppedAreaPixels);
};
const handlePhotoSelect=(e: ChangeEvent<HTMLInputElement>)=>{
  const file = e?.target?.files?.[0];
  if(file){
   const imageUrl = URL.createObjectURL(file);
   setSelectedImage(imageUrl)
  }
  setPostImageSettingBox(true)
}

const handleDoneCrop=async()=>{
  if (croppedArea && selectedImage) {  
        const croppedImage = await getCroppedImg(selectedImage, croppedArea);
        setImage(croppedImage)
        setPostImageSettingBox(false);
}
}

useEffect(()=>{
        searchUsers()
},[searchInput,searchUsers])

interface User{
   _id:string,
   name:string,
   photo:{
    url:string
   }
}

    return(

<div className="w-screen h-screen flex flex-col md:flex-row">
  <div className="fixed w-screen h-[8%] top-0 md:hidden">
    <HeadMobile pagename="Home" />
  </div>

  <div className="hidden md:block md:w-[18%] md:h-screen">
    <MenuBar pagename="Home" />
  </div>

  <div className="container overflow-y-scroll space-y-6 md:space-y-10 flex flex-col items-center w-full md:w-[82%] py-[20%] px-[5%] md:p-5">

    <div className="w-full h-[10%] md:h-[10%] flex items-center ps-2 relative">
      <div className="w-[93%] h-8 md:h-10 px-2 space-x-2 border border-gray-400 rounded-lg flex flex-row items-center">
        <img className="w-6 h-6" src="/assets/icons/icons8-search-50.png" alt="" />
        <input
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          className="h-full w-full focus:outline-none"
          placeholder="Search people...."
        />
      </div>

      {searchInput && (
        <div className="absolute top-full left-2 w-[90%] md:w-[40%] bg-white shadow-lg rounded-md">
          <div className="w-full p-3 h-full border border-gray-300 rounded-md">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-semibold">Search results</h1>
            </div>
            <hr className="my-2" />
            <div className="w-full h-85 overflow-y-scroll">
              {users.length > 0 ? (
                users.map((user: User) => (
                  <div
                    key={user?._id}
                    onClick={() => {
                      navigate('/profilepage', { state: { user: user?._id } })
                    
                    }}
                    className="w-full h-14 p-2 flex cursor-pointer items-center space-x-3 hover:bg-gray-100 transition duration-300"
                  >
                    <img className="w-10 h-10 rounded-full" src={`${user?.photo.url}`} alt="" />
                    <h1 className="text-base font-semibold">{user?.name}</h1>
                  </div>
                ))
              ) : (
                <div className="text-center mt-4">
                  <h1>No search results.</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

    <AddPost setNewPostAdded={setNewPostAdded} handlePhotoSelect={handlePhotoSelect} image={image} />

    {postImageSettingBox && (
      <div className="fixed p-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-black z-10 space-y-2 w-[90%] md:w-[50%] h-[60%] bg-white">
        {selectedImage && (
          <div style={{ position: 'relative', width: '100%', height: '90%' }}>
            <ReactCrop
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}
        <div className="w-full flex justify-between">
          <button onClick={() => setPostImageSettingBox(false)} className="bg-red-500 font-semibold text-sm py-1 px-2 text-white rounded-md">
            Cancel
          </button>
          <button onClick={handleDoneCrop} className="bg-blue-600 font-semibold text-sm py-1 px-2 text-white rounded-md">
            Done
          </button>
        </div>
      </div>
    )}

    {allPosts?.length > 0 ? (
      allPosts?.map((post) => <Post  post={post} />)
    ) : postsLoading ? (
      <PostShimmer />
    ) : (
      <div className="w-full h-full border-2 flex flex-col justify-center space-y-5 items-center">
        <div className="rounded-full w-52 h-52 border-2 flex items-center justify-center border-black">
          <img src="/assets/icons/icons8-camera-100.png" alt="" />
        </div>
        <h1 className="text-2xl font-bold">No Posts Yet</h1>
      </div>
    )}
  </div>

  <div className="fixed w-screen h-[8%] bottom-0 md:hidden">
    <FootMobile pagename="Home" />
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
export default HomePage







