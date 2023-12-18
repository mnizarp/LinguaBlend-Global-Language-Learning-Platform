import axios from "axios"
import { useState } from "react"
import { Button } from "../../../@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../@/components/ui/dialog"
import { Input } from "../../../@/components/ui/input"
import { Label } from "../../../@/components/ui/label"
import toast from "react-hot-toast"
import { BASE_URL } from "../../constants"


interface AddNewCountryProps {
  setCountryAdded: React.Dispatch<React.SetStateAction<string>>;
}

export function AddNewCountry({setCountryAdded}:AddNewCountryProps) {

    const [country,setCountry]=useState('')  
    const [flag,setFlag]=useState<FileList |string|null>('')
    const [isOpen,setIsOpen]=useState(true)
    const handleSave=async()=>{
        try{
           
            const formData=new FormData()
            if(flag){
              formData.append('flag',flag[0])
            }            
            formData.append('country',country)
            const response=await axios.post(`${BASE_URL}admin/addnewcountry`,  formData, {
                headers: {
                  'Content-Type': 'multipart/form-data', 
                }             
              });
            if(response.status==200){
              setCountryAdded('yes')
              setIsOpen(false)
              setCountry('')
              setFlag('')
            }
        }catch (error: unknown) {
          const apiError = error as { response?: { status?: number } };
        
          if (apiError?.response?.status === 401) {
            toast.error('Country Already exists');
          } else {
            toast.error('An error occurred. Cannot Add country');
          }
        }
    }
  return (
    
    
       <Dialog>
       <DialogTrigger onClick={()=>setIsOpen(true)} asChild>
         <Button className="bg-blue-500  text-white" variant="outline">+ Add New Country </Button>
       </DialogTrigger>
       {
        isOpen ?
        <DialogContent  className="sm:max-w-[425px] border-2 border-black rounded-lg  max-h-max inset-y-[30vH] inset-x-[550px]   bg-white  p-5">
        <DialogHeader className="space-y-5">
          <DialogTitle>Add New Country</DialogTitle>
          <DialogDescription>
            Fill details of the new Country here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Country
            </Label>
                <Input
                id="country"
                type="text"
                value={country}
                onChange={(e)=>setCountry(e.target.value)}
                placeholder="Enter new country"
                className="col-span-3"
                />

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Flag
            </Label>
            <Input
              id="flag"
              type="file"
              onChange={(e)=>setFlag(e.target.files)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          {
            flag !='' && country !='' ?
            <Button onClick={handleSave}  className="bg-blue-500 text-white" >Save</Button>
            :
            <Button  className="bg-blue-500 cursor-not-allowed text-white" >Save</Button>
          }
   
        </DialogFooter>
      </DialogContent>
      :
      null
       }
      
     </Dialog>
 
  )
}
