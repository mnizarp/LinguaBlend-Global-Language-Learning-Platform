import {  useState } from "react"
import HidePostConfirm from "./HidePostConfirm"

interface PostReportCardProps {
  setUpdate: React.Dispatch<React.SetStateAction<string>>;
  report: {
    reporter: {
      _id: string;
      name: string;
      photo: {
        url:string
      }
    };
    report_reason: string;
    posteduser: {
      _id: string;
      name: string;
      photo: {
        url:string
      }
    };
    post: {
      _id: string;
      post_image: string;
      caption: string;
      isHide: boolean;
    };
  };
}

const PostReportCard:React.FC<PostReportCardProps>=(props)=>{
  
  const [hidePostId,setHidePostId]=useState('')
  const [showHideConfirmation,setShowHideConfirmation]=useState(false)
 
  const handleHidePost=(postId:string)=>{
    props?.setUpdate('change')
    setHidePostId(postId)
    setShowHideConfirmation(true)
  }
  const handleHideConfirmClose=()=>{
    setShowHideConfirmation(false)
    setHidePostId('')
    props?.setUpdate('changed')
  }

    return(
      <div className="flex flex-col space-y-2 w-full">
         {showHideConfirmation && <HidePostConfirm postId={hidePostId} setOpen={handleHideConfirmClose} />}
        <div className="flex space-x-2 items-center">
           <img className="w-9 h-9 rounded-full" src={`${props?.report?.reporter?.photo.url}`}  alt=""/>
           <h1 className="text-lg font-semibold">{props?.report?.reporter?.name}</h1>
        </div>
           <div className="flex w-[90%] h-[500px] space-x-5 p-3 border  rounded-md">
               <div className="w-[30%] h-full p-2 bg-slate-100">
                <h1 className="text-lg font-semibold">Report:-</h1>
                  <p>{props?.report?.report_reason}</p>
               </div>
           <div className="w-[70%] h-full flex flex-col  justify-center space-y-3">
                <div className="flex space-x-2 items-center ">
                <img className="w-8 h-8 rounded-full" src={`${props?.report?.posteduser?.photo.url}`} alt=""/>
                <h1 className="text-lg font-semibold">{props?.report?.posteduser?.name}</h1>
                </div>
                <div className="w-full flex space-x-3">
                <img className= "w-[70%]" src={`${props?.report?.post?.post_image}`} alt=""/>
                <p>{props?.report?.post?.caption}</p>
                </div>    
                {
                  props?.report?.post?.isHide == true ?
                  <button className="bg-red-500 w-32 text white rounded-md p-1 cursor-default text-white text-sm" >Hidden</button>
                  :
                  <button onClick={()=>handleHidePost(props?.report?.post?._id)} className="bg-red-500 w-32 text white rounded-md p-1 text-white text-sm" >Hide Post </button>
                }
               </div>
           </div>
      </div>
    )
}
export default PostReportCard