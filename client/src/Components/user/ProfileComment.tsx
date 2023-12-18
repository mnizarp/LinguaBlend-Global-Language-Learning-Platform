import { useSelector } from "react-redux"
import useTimeDiff from "../../CustomHooks/useTimeDiff"
import { useState } from "react"
import { RootState } from "../../store/rootReducer"
import { useEditCommentMutation } from "../../slices/usersApiSlice"
import { useNavigate } from "react-router-dom"

interface ProfilecommentProps{
  setCommentAdded:React.Dispatch<React.SetStateAction<string>>,
  comment:{
    comment:string
    _id:string
    user:{
      _id:string
      name:string
      photo:{
        url:string
      }
    }
    createdAt:Date
  }
}

const ProfileComment=(props:ProfilecommentProps)=>{
  const {userInfo}=useSelector((state:RootState)=>state.auth)
  const [isEditing,setIsEditing]=useState(false)
  const [editedComment,setEditedComment]=useState('')
  const handleEditButton=()=>{
    setEditedComment(props?.comment?.comment)
    setIsEditing(true)
  }
  const [editComment]=useEditCommentMutation()
  const handleSubmitButton=async()=>{
      try {
        const token=userInfo?.token
        props.setCommentAdded('start edit')
        await editComment({token,datas:{commentId:props?.comment?._id,editedComment}})
        setIsEditing(false)
        props.setCommentAdded('edited')
      } catch (error) {
        console.log(error)
      }
  }

  const navigate=useNavigate()

    return(
          <div className="h-max  flex items-center w-full space-x-2" >
            <img onClick={()=> navigate('/profilepage',{ state: { user:props?.comment?.user?._id} })}  className="w-8 cursor-pointer  h-8 rounded-full" src={`${props?.comment?.user?.photo.url}`} alt=""/>
          <div className="flex flex-col w-[95%] space-y-1 bg-slate-50 p-1 md:p-2 rounded-xl ">
          <div className="flex w-full justify-between items-center">
             <h1 className="font-bold text-md">{props?.comment?.user?.name}</h1>
             <div className="flex items-center space-x-1">
             <h1 className="text-xs">{useTimeDiff(props?.comment?.createdAt)}</h1>
             {
                props?.comment?.user?._id === userInfo?._id ? 
                isEditing?
                <div onClick={handleSubmitButton} className="h-4 cursor-pointer bg-blue-500 px-1 rounded-sm"><h1 className="text-xs text-white">Save</h1></div>
                :
                <img onClick={handleEditButton} className="w-4 h-4 cursor-pointer" src="/assets/icons/icons8-edit-30.png" alt=""/>
                :
                null
              }
             </div>
            </div>   
            {
            isEditing ?
            <textarea className="" onChange={(e)=>setEditedComment(e.target.value)} value={editedComment} />
            :       
            <p className=" break-words text-xs md:text-sm">{props?.comment?.comment}</p>   
            }    
          </div>
          </div>  
    )
}
export default ProfileComment

