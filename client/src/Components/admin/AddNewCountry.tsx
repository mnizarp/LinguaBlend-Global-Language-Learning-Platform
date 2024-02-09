
import { ChangeEvent, useState } from "react"
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
import { useSelector } from "react-redux"
import { RootState } from "../../store/rootReducer"
import { useAddCountryMutation } from "../../slices/adminApiSlice"
import * as Yup from 'yup';

interface AddNewCountryProps {
  setCountryAdded: React.Dispatch<React.SetStateAction<string>>;
}

export function AddNewCountry({setCountryAdded}:AddNewCountryProps) {



    const {adminInfo}=useSelector((state:RootState)=>state.admin)
    const [country,setCountry]=useState('')  
    const [flag,setFlag]=useState<FileList|ArrayBuffer |string|null>('')
    const [isOpen,setIsOpen]=useState(true)


    const handlePhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e?.target?.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = () => {
              const base64String = reader.result;
              setFlag(base64String);
          };
          reader.readAsDataURL(file);
      }
  };
  

    const [addCountry]=useAddCountryMutation()

    const countryValidationSchema = Yup.string()
    .required('country is required')
    .min(3, 'country must contain at least 3 character');

    const handleSave=async()=>{
      try{
       const trimmedcountry = country.trim();
          await countryValidationSchema.validate(trimmedcountry);
           await addCountry({token:adminInfo?.token,datas:{flag,country:trimmedcountry}})
           
            setCountryAdded('yes')
            setIsOpen(false)
            setCountry('')
            setFlag('')
        
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
              // onChange={(e)=>setFlag(e.target.files)}
              onChange={handlePhotoSelect}
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
