
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useAddPostMutation } from "../../slices/usersApiSlice"
import {RootState} from '../../store/rootReducer'

interface AddPostProps{
  setNewPostAdded:React.Dispatch<React.SetStateAction<string>>,
  handlePhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void,
  image:string|unknown
}

const AddPost:React.FC<AddPostProps>=({setNewPostAdded,handlePhotoSelect,image})=>{
    
    const {userInfo}=useSelector((state:RootState)=>state.auth)
    const [postImage,setPostImage]=useState<string|unknown>('')
    const [caption,setCaption]=useState('')

    const [addPost]=useAddPostMutation()
    const handleSubmitPost=async()=>{
       try{
        setNewPostAdded('added')
        await addPost({token:userInfo?.token,datas:{postImage:image,caption,userId:userInfo?._id}})
            setPostImage('')
            setCaption('')
            setNewPostAdded('add')
       }catch(error){
        console.log(error)
       }
    }


    useEffect(()=>{
      setPostImage(image)
    },[image])

    return(
        <div className=" w-full h-[10%] md:h-[15%] flex items-center space-x-2 md:space-x-5" >
          <img className="w-8 h-8 md:w-10 md:h-10 rounded-full" src={`${userInfo?.photo.url}`} alt=""/>
          <div className=" flex bg-slate-50 w-[90%] h-full border-2 rounded-sm">
            <div className="w-[30%] md:w-[20%] h-full flex p-4 items-center justify-center ">
                  {
                    postImage && typeof image=='string' ?
                    <img className="h-full w-full" src={image} alt=""/>
                        :
                    <img className="" src="/assets/icons/icons8-add-image-48.png" alt=""/>                
                 } 
                <input className=" absolute opacity-0" accept="image/*" onChange={handlePhotoSelect} type="file"  />
            </div>
            <textarea value={caption} onChange={(e)=>setCaption(e.target.value)} className="bg-slate-50 p-3 w-[70%] md:w-[80%] h-full placeholder:text-xs md:placeholder:text-sm border-s-2 " placeholder="Enter the text here...." />
          </div>
          {
            postImage && caption ?
            <img onClick={handleSubmitPost} className="md:w-10 w-8 h-8 md:h-10 cursor-pointer " src="/assets/icons/icons8-send-letter-50.png" alt="" />
             :
           <img  className="md:w-10 w-8 h-8 md:h-10 cursor-not-allowed  " src="/assets/icons/icons8-send-letter-50.png" alt="" />
        
          }
        </div>
    )
}

export default AddPost