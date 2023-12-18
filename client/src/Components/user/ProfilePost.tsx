import { useSelector } from "react-redux"
import { useCallback, useEffect,useState } from "react"
import DeleteConfirm from "./DeleteConfirm"
import useTimeDiff from "../../CustomHooks/useTimeDiff"
import ProfileComment from "./ProfileComment"
import { RootState } from "../../store/rootReducer"
import { useAddCommentMutation, useEditPostMutation, useGetCommentsMutation, useLikeUnlikeMutation, useReportPostMutation } from "../../slices/usersApiSlice"
import io from 'socket.io-client'
import { Socket } from 'socket.io-client';
import { ENDPOINT } from "../../constants"
let socket:Socket


interface ProfilePostProps{
    post:{
      _id:string
      likes: (string | undefined)[];
      caption:string
      user:{
        _id:string
        name:string
        photo:{
          url:string
        }
      }
      post_image:string
      createdAt:Date
    }
}

const ProfilePost:React.FC<ProfilePostProps>=(props)=>{
    const {userInfo}=useSelector((state:RootState)=>state.auth)
    const [comment,setComment]=useState('')
    const [allComments,setAllComments]=useState([])
    const [like,setLike]=useState(false)
    const [likeCount,setLikeCount]=useState(props?.post?.likes.length)

    const [newCaption,setNewCaption]=useState(props?.post?.caption)
    const [reportReason,setReportReason]=useState('')

    
    const [, setsocketConnected] = useState(false)

    useEffect(()=>{
      socket=io(ENDPOINT)
      socket.emit('setup',userInfo)
      socket.on('connected',()=>setsocketConnected(true))
    
    },[userInfo])

    const [likeUnlike]=useLikeUnlikeMutation()
    const handleLike=async(postId:string)=>{
      try{   
        const token=userInfo?.token
         const response=await likeUnlike({token,datas:{postId:postId as string}}).unwrap()
         setLike(response.liked)
         if(response.liked==true){
          setLikeCount(likeCount+1)
          socket.emit('new notification',response?.newnotification)
        }else{
          setLikeCount(likeCount-1)
        }
      }catch(error){
       console.error(error)
      }
     }
     const [commentAdded,setCommentAdded]=useState('')
     const [addComment]=useAddCommentMutation()
     const handleCommentSubmit=async()=>{
      try{
        const token=userInfo?.token
             await addComment({token,datas:{comment,userId:userInfo?._id,postId:props?.post?._id}}).unwrap()          
              setComment('')
              setCommentAdded('comment added')
      }catch(error){
          console.log(error)
      }      
  }
   
  const [getComments]=useGetCommentsMutation()
  const getAllComments=useCallback(async()=>{
    try{
      const token=userInfo?.token
      const response=await getComments({token,datas:{postId:props?.post?._id}}).unwrap()
        setAllComments(response.allcomments)
    }catch(error){
        console.log(error)
    }
},[props?.post?._id,userInfo?.token,getComments])

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditBox,setShowEditBox]=useState(false)
  const [showReportBox,setShowReportBox]=useState(false)


  useEffect(()=>{
    getAllComments()  
  },[commentAdded,showDeleteConfirmation,getAllComments])

  useEffect(()=>{
    if(props?.post?.likes.includes(userInfo?._id)){
      setLike(true)
    }else{
      setLike(false)
    }   
  },[props?.post?.likes,userInfo?._id])

 
  const handleDeleteButton = () => {  
    setShowDeleteConfirmation(true);
  }
   const handleDeleteConfirmClose = () => {
   setShowDeleteConfirmation(false);
 };

 const editHandleButton=()=>{
    setShowEditBox(true)
 }

 const handleReportButton=()=>{
  setShowReportBox(true)
 }

 const handleCancelButton=()=>{
   setShowEditBox(false)
   setShowReportBox(false)
 }

 const [editPost]=useEditPostMutation()
 const handleSaveButton=async()=>{
  try{
    const token=userInfo?.token
      await editPost({token,datas:{postId:props?.post?._id,newCaption}}).unwrap()
      setShowEditBox(false)
  }catch(error){
   console.log(error)
  }
 }

 const [reportPost]=useReportPostMutation()
 const handleReportSend=async()=>{
  try{
    const token=userInfo?.token
      await reportPost({token,datas:{postId:props?.post?._id,reportReason}}).unwrap()
      setShowReportBox(false)
  }catch(error){
    console.log(error)
  }
 }

    return(
       <div className="w-full flex flex-col space-y-3">
          <div className="flex space-x-2 items-center">
             <img className="w-8 h-8 rounded-full" src={`${props?.post?.user?.photo.url}`} alt=""/>
             <div>
                <h1 className="text-sm font-semibold">{props.post?.user?.name}</h1>
                <h6 className="text-xs">{useTimeDiff(props?.post?.createdAt)}</h6>
             </div>
          </div>
          <img className="w-full" src={`${props?.post?.post_image}`} alt=""/>
          <div className="flex justify-between">
                <div className="flex space-x-1">
                  {
                     like ?
                     <img onClick={()=>handleLike(props?.post?._id)} className="w-[25px] h-[25px] cursor-pointer " src="/assets/icons/icons8-love-red-48.png" alt=""/>
                         :
                     <img onClick={()=>handleLike(props?.post?._id)} className="w-[25px] h-[25px] cursor-pointer " src="/assets/icons/icons8-love-black-48.png" alt=""/>
    
                  }
                  <h1>{likeCount} Likes</h1>
                </div>
                {
                  props.post?.user?._id == userInfo?._id ?
                  <div className="flex space-x-2">
                  <img onClick={editHandleButton} className="w-6 h-6 cursor-pointer" src="/assets/icons/icons8-edit-30.png" alt=""/>
                  <img onClick={handleDeleteButton} className="w-6 h-6 cursor-pointer" src="/assets/icons/icons8-delete-60.png" alt=""/>
                  {showDeleteConfirmation && <DeleteConfirm postId={props?.post?._id} setOpen={handleDeleteConfirmClose} />}

                </div>
                :
                <button onClick={handleReportButton}  className="bg-red-500 text-xs p-1 rounded-md font-semibold text-white" >Report</button>
                }  
          </div>
          {
            showReportBox && 
            <div className="w-full flex items-center border rounded-md px-1 space-x-2 ">
            <textarea onChange={(e)=>setReportReason(e.target?.value)} value={reportReason} className="w-[94%]  " placeholder="Type your report here...." />
            <div className="flex space-x-2">
              <button onClick={handleCancelButton} className="bg-gray-700 text-white w-16 rounded-md p-1" >Cancel</button>
              <button onClick={handleReportSend} className="bg-blue-700 text-white w-16 rounded-md p-1"  >Send</button>
            </div>
            </div>
          }
          
          {
            showEditBox ?
            <div className="w-full flex items-center border rounded-md px-1 space-x-2 ">
            <textarea onChange={(e)=>setNewCaption(e.target.value)} value={newCaption} className="w-[94%]  " placeholder="Type your caption here...." />
            <div className="flex space-x-2">
              <button onClick={handleCancelButton} className="bg-gray-700 text-white w-16 rounded-md p-1" >Cancel</button>
              <button onClick={handleSaveButton} className="bg-blue-700 text-white w-16 rounded-md p-1"  >Save</button>
            </div>
            </div>
            :
            <p className="text-sm">{props.post?.caption}</p>
          }
          
          <div className="flex w-full space-x-3 items-center">
              <img className="w-8 h-8 rounded-full" src={`${userInfo?.photo.url}`} alt=""/>
              <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-[90%] bg-slate-100 rounded-3xl px-[7px] pt-4  md:pt-4 md:px-[18px] placeholder:text-xs md:placeholder:text-sm" placeholder="Type comment here ..." />
              {
                comment ?
              <img onClick={handleCommentSubmit}  className="w-8  h-8  cursor-pointer " src="/assets/icons/icons8-send-letter-50.png" alt="" />
                 : 
               <img className="w-8  h-8  cursor-not-allowed " src="/assets/icons/icons8-send-letter-50.png" alt="" />
              }
              </div>
          <h1 className="font-bold">Comments({allComments?.length})</h1>
          {
            allComments?.length>0 &&
                 <div className=" w-full h-[200px] space-y-2 overflow-y-scroll" style={{overflow:'auto'}} >
                  {
                            allComments?.map((comment)=>(
                                    <ProfileComment setCommentAdded={setCommentAdded} comment={comment} />
                          ))
                  }           
                  </div>
          }        

 
       </div>
    )
}
export default ProfilePost