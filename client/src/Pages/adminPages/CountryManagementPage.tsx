import {  useEffect, useState } from "react"
import { AddNewCountry } from "../../Components/admin/AddNewCountry"
import { CountryTable } from "../../Components/admin/CountryTable"
import Header from "../../Components/admin/Header"
import { Toaster } from "react-hot-toast"
import { useSelector } from "react-redux"
import { RootState } from "../../store/rootReducer"
import { useNavigate } from "react-router-dom"

const CountryManagementPage:React.FC=()=>{
  const {adminInfo}=useSelector((state:RootState)=>state.admin)
  const navigate=useNavigate()
  useEffect(()=>{
      if(!adminInfo){
         navigate('/admin')
      }
  },[adminInfo,navigate])

  const [countryAdded,setCountryAdded]=useState('')
    return(
        <div>
            <Header pagename="Countries" />
            <Toaster/>
            <div className="container p-3">
                <div className="flex justify-between">
                  <h1 className="text-3xl font-bold">Country List</h1>
                  <AddNewCountry setCountryAdded={setCountryAdded} />
                </div>
              <CountryTable countryAdded={countryAdded} />
            </div>
        </div>
    )
}
export default CountryManagementPage