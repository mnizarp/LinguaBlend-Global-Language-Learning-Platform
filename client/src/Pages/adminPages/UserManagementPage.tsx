
import { UserTable } from "../../Components/admin/UserTable"
  
import Header from "../../Components/admin/Header"
import { useSelector } from "react-redux"
import { RootState } from "../../store/rootReducer"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const UserManagementPage:React.FC=()=>{
    const {adminInfo}=useSelector((state:RootState)=>state.admin)
  const navigate=useNavigate()
  useEffect(()=>{
      if(!adminInfo){
         navigate('/admin')
      }
  },[adminInfo,navigate])
    return(
        <div>
            <Header pagename="Users" />
            <div className="container p-2">
             <h1 className="font-bold text-4xl">Users List</h1>   
            <UserTable/>
            </div>
            
           
        </div>
    )
}
export default UserManagementPage