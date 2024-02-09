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
import { RootState } from "../../store/rootReducer"
import { useSelector } from "react-redux"
import { useAddLanguageMutation } from "../../slices/adminApiSlice"
import * as Yup from 'yup';

interface AddNewLanguageProps {
  setLanguageAdded: React.Dispatch<React.SetStateAction<string>>;
}

export function AddNewLanguage({setLanguageAdded}:AddNewLanguageProps) {

    const {adminInfo}=useSelector((state:RootState)=>state.admin)
    const [language,setLanguage]=useState('')  
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

   const [addLanguage]=useAddLanguageMutation()

   const languageValidationSchema = Yup.string()
    .required('language is required')
    .min(3, 'language must contain at least 3 character');

    const handleSave=async()=>{
      try{
          const trimmedlanguage = language.trim();
          await languageValidationSchema.validate(trimmedlanguage);
        await addLanguage({token:adminInfo?.token,datas:{flag,language:trimmedlanguage}})
          
              setLanguageAdded('yes')
              setIsOpen(false)
              setLanguage('')
              setFlag('')
          
      }catch (error: unknown) {
        const apiError = error as { response?: { status?: number } };
      
        if (apiError?.response?.status === 401) {
          toast.error('Language Already exists');
        } else {
          toast.error('An error occurred. Cannot Add language');
        }
      }
  }
  return (
    <Dialog  >
      <DialogTrigger onClick={()=>setIsOpen(true)} asChild>
        <Button  className="bg-blue-500  text-white" variant="outline">+ Add New Language </Button>
      </DialogTrigger>
      {
        isOpen ?
        <DialogContent  className="sm:max-w-[425px] border-2 border-black rounded-lg  max-h-max inset-y-[30vH] inset-x-[550px]   bg-white  p-5">
        <DialogHeader className="space-y-5">
          <DialogTitle>Add New Language</DialogTitle>
          <DialogDescription>
            Fill details of the new Language here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Language
            </Label>
                <Input
                id="language"
                type="text"
                value={language}
                onChange={(e)=>setLanguage(e.target.value)}
                placeholder="Enter new language"
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
              onChange={handlePhotoSelect}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          {
            flag !='' && language !='' ?
             <Button onClick={handleSave}  className="bg-blue-500 text-white" >Save</Button> 
             :
             <Button   className="bg-blue-500 cursor-not-allowed text-white" >Save</Button>             
          }
          
        </DialogFooter>
      </DialogContent>
      :
      null
      }
     
    </Dialog>
  )
}
