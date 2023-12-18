
import { useEffect, useState } from "react"
import {AddNewLanguage} from "../../Components/admin/AddNewLanguage"
import Header from "../../Components/admin/Header"

import { LanguageTable } from "../../Components/admin/LanguageTable"
import { Toaster } from "react-hot-toast"
import { useSelector } from "react-redux"
import { RootState } from "../../store/rootReducer"
import { useNavigate } from "react-router-dom"

const LanguageManagementPage:React.FC=()=>{
    const {adminInfo}=useSelector((state:RootState)=>state.admin)
  const navigate=useNavigate()
  useEffect(()=>{
      if(!adminInfo){
         navigate('/admin')
      }
  },[adminInfo,navigate])
    const [languageAdded,setLanguageAdded]=useState('')
    return(
        <div>
            <Header pagename="Languages"/>
            <Toaster/>
            <div className="container p-3">
                <div className="flex justify-between">
                  <h1 className="text-3xl font-bold">Language List</h1>
                  <AddNewLanguage setLanguageAdded={setLanguageAdded} />
                </div>
               <LanguageTable languageAdded={languageAdded} />
            </div>
           
        </div>
    )
}
export default LanguageManagementPage