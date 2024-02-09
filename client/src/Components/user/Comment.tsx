import { useSelector } from "react-redux"
import useTimeDiff from "../../CustomHooks/useTimeDiff"
import { RootState } from "../../store/rootReducer"
import { useState } from "react"
import { useEditCommentMutation } from "../../slices/usersApiSlice"
import { useNavigate } from "react-router-dom"
import * as Yup from 'yup';

interface CommentProps{
  setCommentAdded:React.Dispatch<React.SetStateAction<string>>
  comment:{
    _id:string
    comment:string
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

const Comment:React.FC<CommentProps>=(props)=>{
  const {userInfo}=useSelector((state:RootState)=>state.auth)
  const [isEditing,setIsEditing]=useState(false)
  const [editedComment,setEditedComment]=useState('')
  const handleEditButton=()=>{
    setEditedComment(props?.comment?.comment)
    setIsEditing(true)
  }
  
  const navigate=useNavigate()
  const [editComment]=useEditCommentMutation()

  const commentValidationSchema = Yup.string()
    .required('Comment is required')
    .min(1, 'Comment must contain at least 1 character');

  const handleSubmitButton=async()=>{
      try {
        const token=userInfo?.token
        props.setCommentAdded('start edit')
        const trimmedComment = editedComment.trim();
          await commentValidationSchema.validate(trimmedComment);
        await editComment({token,datas:{commentId:props?.comment?._id,editedComment:trimmedComment}}).unwrap()
        setIsEditing(false)
        props.setCommentAdded('edited')
      } catch (error) {
        console.log(error)
      }
  }

    return(
        <div className="h-max flex items-center space-x-2">
        <img onClick={()=> navigate('/profilepage',{ state: { user:props?.comment?.user?._id } })} className="w-8 h-8 cursor-pointer rounded-full" src={`${props?.comment?.user?.photo.url}`} alt=""/>
          <div className="flex flex-col w-[89%] space-y-1 bg-slate-50 p-1  rounded-xl">
            <div className="flex w-full justify-between items-center">
             <h1 className="font-bold text-xs md:text-md">{props?.comment?.user?.name}</h1>
             <div className="flex items-center space-x-1">
             <h1 className="text-xs">{useTimeDiff(props?.comment?.createdAt)}</h1>
             {
                props?.comment?.user?._id === userInfo?._id ?
                isEditing?

                editedComment ?
                <div onClick={handleSubmitButton} className="h-4 cursor-pointer bg-blue-500 px-1 rounded-sm"><h1 className="text-xs text-white">Save</h1></div>
                :
                <div  className="h-4 cursor-not-allowed bg-blue-500 px-1 rounded-sm"><h1 className="text-xs text-white">Save</h1></div>

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
            <p className="break-words text-xs md:text-sm">{props?.comment?.comment}</p>
           }

          </div>
       </div>  
    )
}
export default Comment