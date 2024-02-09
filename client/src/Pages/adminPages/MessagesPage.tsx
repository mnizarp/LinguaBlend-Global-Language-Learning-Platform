import { useCallback, useEffect, useState } from "react"
import Header from "../../Components/admin/Header"
import { useGetAdminContactsMutation  } from "../../slices/adminApiSlice"
import { useSelector } from "react-redux"
import { RootState } from "../../store/rootReducer"
import { useNavigate } from "react-router-dom"

interface AdminContact{
  user_name:string,
  user_email:string,
  content:string
}

const MessagesPage:React.FC=()=>{
  const {adminInfo}=useSelector((state:RootState)=>state.admin)
  const navigate=useNavigate()
  useEffect(()=>{
      if(!adminInfo){
         navigate('/admin')
      }
  },[adminInfo,navigate])
   
    const [adminContacts,setAdminContacts]=useState<AdminContact[]>([])
    const [getAdminContacts]=useGetAdminContactsMutation()
    
    const getAllAdminContacts=useCallback(async()=>{
      try{
        const response=await getAdminContacts({token:adminInfo?.token}).unwrap()
          console.log(response)
          setAdminContacts(response)  
      }catch(error){
        console.log(error)
      }
    },[getAdminContacts,adminInfo])


   useEffect(()=>{
     getAllAdminContacts()
   },[getAllAdminContacts])

    return(
        <div>
            <Header pagename="Messages"/>
            
               
               
                    <div className="w-screen container space-y-7 p-3 ">
                       <h1 className="text-3xl font-bold">Messages</h1>
                       {
                        adminContacts?.length > 0 ? 

                        adminContacts?.map(contact => (
                          <div  className="bg-white shadow-md rounded-lg p-4 mb-4">
                            <p className="text-xl font-semibold text-gray-800">Message from {contact.user_name}</p>
                            <p className="text-gray-600">Account Email: {contact.user_email}</p>
                            <p className="text-gray-700 mt-2">{contact.content}</p>
                          </div>
                        ))
                        
                        :
                        <div className="w-full h-full flex items-center justify-center">
                        <p className="text-lg font-semibold text-gray-500">No Messages available.</p>
                        </div>
                       }
                    </div>

                  
         </div>
    )
}
export default MessagesPage