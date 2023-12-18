import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import useTimeDiff from "../../CustomHooks/useTimeDiff"
import Comment from "./Comment"
import { RootState } from "../../store/rootReducer"
import { useAddCommentMutation, useGetCommentsMutation, useLikeUnlikeMutation } from "../../slices/usersApiSlice"
import io from 'socket.io-client'
import { Socket } from 'socket.io-client';
import { ENDPOINT } from "../../constants"
let socket:Socket

interface PostProps {
  post: {
    likes: (string | undefined)[];
    _id: string;
    user:{
      _id:string
      name:string
      photo:{
        url:string
      }
    }
    post_image:string
    caption:string
    createdAt:Date
  };
}



const Post:React.FC<PostProps>=(props)=>{

    const {userInfo}=useSelector((state:RootState)=>state.auth)
    const [comment,setComment]=useState('')
    const [allComments, setAllComments] = useState([]);
    const [like,setLike]=useState(false)
    const [likeCount,setLikeCount]=useState(props?.post?.likes.length as number)
    const navigate=useNavigate()
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
          setCommentAdded('comment adde')
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

    useEffect(()=>{
      getAllComments()
    },[commentAdded,getAllComments])

    useEffect(()=>{
      if(props?.post?.likes.includes(userInfo?._id)){
        setLike(true)
      }else{
        setLike(false)
      }   
    },[props?.post?.likes,userInfo?._id])

    return(
        <div className="w-[95%] h-max md:h-[500px]  flex flex-col md:flex-row space-y-2  md:space-y-2 md:space-x-4 ">

            {/*profile details image and caption */}
            <div className="w-full md:w-[60%] h-max md:h-full space-y-3 md:space-y-2 " >
                <div className="h-[5%] md:h-[10%] w-[50%] flex items-center space-x-2">
                <img onClick={()=> navigate('/profilepage',{ state: { user:props?.post?.user?._id } })} className="w-8 md:w-10 h-8 md:h-10 cursor-pointer rounded-full" src={`${props?.post?.user?.photo.url}`} alt=""/>
                <div className="flex flex-col">
                 <h1 className="text-sm font-semibold md:font-bold">{props?.post?.user?.name}</h1>
                 <h6 className="text-xs md:text-sm">{useTimeDiff(props?.post?.createdAt)}</h6>
                </div>
                </div>           
                <div className="h-[60%] md:h-[75%] w-full">
                   <img className="w-[99%] h-full object-fit" src={`${props?.post?.post_image}`} alt=""/>
                </div>
                <div className=" flex justify-between">
                <div className="flex space-x-1 items-center">
                  {
                     like ?
                     <img onClick={()=>handleLike(props?.post?._id)} className="w-[20px] h-[20px] md:w-[25px] md:h-[25px] cursor-pointer " src="/assets/icons/icons8-love-red-48.png" alt=""/>
                         :
                     <img onClick={()=>handleLike(props?.post?._id)} className="w-[20px] h-[20px] md:w-[25px] md:h-[25px] cursor-pointer " src="/assets/icons/icons8-love-black-48.png" alt=""/>
    
                  }
                  <h1 className="text-xs md:text-md">{likeCount} Likes</h1>
                </div>
                </div>
                <div className="h-max w-full">
                <p className="text-xs md:text-sm">{props?.post?.caption}</p>
                </div>
            </div>

            {/* add comment and comments */}
            <div className="w-full md:w-[40%] h-[33%] flex flex-col md:h-full  space-y-7 md:space-y-2">
              <div className="flex w-full h-[10%] md:h-[13%] items-center space-x-2">
              <img className="w-8 md:w-10 h-8 md:h-10 rounded-full" src={`${userInfo?.photo.url}`} alt=""/>
              <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-[75%] bg-slate-100 rounded-3xl pt-2 px-[10px]  md:pt-4 md:px-[18px] placeholder:text-xs md:placeholder:text-sm" placeholder="Type comment here ..." />
              {
                comment ?
                <img onClick={handleCommentSubmit} className="w-8 md:w-10 h-8 md:h-10 cursor-pointer " src="/assets/icons/icons8-send-letter-50.png" alt="" />
                   :
                 <img  className="w-8 md:w-10 h-8 md:h-10 cursor-not-allowed " src="/assets/icons/icons8-send-letter-50.png" alt="" />
 
              }
              </div>
              <div className="">
              <h1 className="text-xs  md:text-sm font-bold">Comments({allComments?.length})</h1>
              </div>
              <div className=" w-full h-[75%] md:h-[80%] space-y-3 overflow-y-scroll" style={{ overflow: 'auto' }}>
                {
                    allComments?.map((comment)=>(
                        <Comment setCommentAdded={setCommentAdded} comment={comment} />
                    ))
                }     
                                
                </div>
              
              
            </div>
          
         
        </div> 
    )
}
export default Post