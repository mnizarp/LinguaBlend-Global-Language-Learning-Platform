import { useCallback, useEffect, useState } from "react"
import Header from "../../Components/admin/Header"
import UserReportCard from "../../Components/admin/UserReportCard"
import PostReportCard from "../../Components/admin/PostReportCard"
import { useGetPostReportsMutation, useGetUserReportsMutation } from "../../slices/adminApiSlice"
import { useSelector } from "react-redux"
import { RootState } from "../../store/rootReducer"
import { useNavigate } from "react-router-dom"


const ReportsPage:React.FC=()=>{
  const {adminInfo}=useSelector((state:RootState)=>state.admin)
  const navigate=useNavigate()
  useEffect(()=>{
      if(!adminInfo){
         navigate('/admin')
      }
  },[adminInfo,navigate])
    const [page,setPage]=useState('user')
    const [postReports,setPostReports]=useState([])
    const [userReports,setUserReports]=useState([])

    const [getPostReports]=useGetPostReportsMutation()
    const getAllPostReports=useCallback(async()=>{
      try{
        const response=await getPostReports({token:adminInfo?.token}).unwrap()
          setPostReports(response.allpostreports)  
      }catch(error){
        console.log(error)
      }
    },[getPostReports,adminInfo])

    const [getUserReports]=useGetUserReportsMutation()
    const getAllUserReports=useCallback(async()=>{
      try{
        const response=await getUserReports({token:adminInfo?.token}).unwrap()
        setUserReports(response.alluserreports)

      }catch(error){
        console.log(error)
      }
    },[getUserReports,adminInfo])

   const handleUserButton=()=>{
    setPage('user')
   }
   const handlePostButton=()=>{
    setPage('post')
   }
   
   const [update,setUpdate]=useState('')

   useEffect(()=>{
    getAllUserReports()
    getAllPostReports()
   },[page,update,getAllPostReports,getAllUserReports])

    return(
        <div>
            <Header pagename="Reports"/>
            <div className="container p-5 w-screen ">
               
                {
                    page == 'user' ? 
                    <div className="flex  rounded-md justify-center items-center">
                    <div onClick={handleUserButton} className="border border-black p-1 bg-blue-500 rounded-md rounded-r-none cursor-pointer flex justify-center w-28">
                    <h1 className="font-semibold">User</h1>
                  </div>
                  <div onClick={handlePostButton} className="border border-black p-1 bg-white rounded-md rounded-s-none cursor-pointer flex justify-center w-28">
                    <h1 className="font-semibold">Post</h1>
                  </div>
                  </div>
                  :
                  <div className="flex  rounded-md justify-center items-center">
                  <div onClick={handleUserButton} className="border border-black p-1 bg-white  rounded-md rounded-r-none cursor-pointer flex justify-center w-28">
                  <h1 className="font-semibold">User</h1>
                </div>
                <div onClick={handlePostButton} className="border border-black p-1 bg-blue-500 rounded-md rounded-s-none cursor-pointer flex justify-center w-28">
                  <h1 className="font-semibold">Post</h1>
                </div>
                </div>
                } 
               
               </div>

               {/* reports */}
               
                { 
                    page == 'user' ?
                    <div className="w-screen container space-y-7 p-3">
                       {
                        userReports?.map((report)=>(
                           <UserReportCard report={report} />
                        ))
                       }
                    </div>
                    :
                    <div className="w-screen container space-y-7 p-3">
                      {
                        postReports?.map((report)=>(
                           <PostReportCard setUpdate={setUpdate} report={report} />
                        ))
                      }
                    </div>
                }
             
               
            </div>
        
    )
}
export default ReportsPage