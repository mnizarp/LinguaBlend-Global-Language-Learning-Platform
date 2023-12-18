import { useNavigate } from "react-router-dom"

interface UserReportCardProps {
  report: {
    reporter: {
      _id: string;
      name: string;
      photo: {
        url: string;
      };
    };
    report_reason: string;
    user: {
      _id: string;
      name: string;
      photo: {
        url: string;
      };
    };
  };
}

const UserReportCard:React.FC<UserReportCardProps>=(props)=>{

  const navigate=useNavigate()
    
  const handleViewProfileButton=(userId:string)=>{
   navigate('/profilemanagement', { state: { userId: userId } })
   }


    return(
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex space-x-2 items-center">
           <img className="w-9 h-9 rounded-full" src={`${props?.report?.reporter?.photo.url}`} alt=""/>
           <h1 className="text-lg font-semibold">{props?.report?.reporter?.name}</h1>
        </div>
           <div className="flex w-[90%] h-[270px] border border-black rounded-md">
               <div className="w-[70%] h-full p-2 bg-slate-100">
                <h1 className="text-lg font-semibold">Report:-</h1>
                  <p>{props?.report?.report_reason}</p>
               </div>
               <div className="w-[30%] h-full flex flex-col items-center justify-center space-y-5">
                    <img className= "rounded-full w-32 h-32" src={`${props?.report?.user?.photo.url}`} alt=""/>
                    <h1 className="text-lg font-semibold">{props?.report?.user?.name}</h1>
                    <div className="flex space-x-2" >
                      <button onClick={()=>handleViewProfileButton(props?.report?.user?._id)} className="bg-blue-500 text white rounded-md p-1 text-white text-sm" >View Profile</button>
                    </div>
               </div>
           </div>
      </div>
    )
}
export default UserReportCard