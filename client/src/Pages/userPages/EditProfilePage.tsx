import HeadMobile from "../../Components/user/HeadMoblile"
import MenuBar from "../../Components/user/MenuBar"
import FootMobile from "../../Components/user/FootMobile"
import { useDispatch, useSelector } from "react-redux"
import Select from 'react-select';
import {useNavigate } from "react-router-dom"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import ReactCrop,{Area} from 'react-easy-crop';
import { setCredentials } from "../../slices/authSlice"
import { RootState } from "../../store/rootReducer"
import getCroppedImg from "../../utils/getCroppedImg"
import { useEditProfileMutation } from "../../slices/usersApiSlice"
import { useGetAllCountriesMutation, useGetAllLanguagesMutation } from "../../slices/adminApiSlice"

import { useAuth0 } from "@auth0/auth0-react"
import { ExtraArgumentType } from "../../thunks/userThunks";
import { AnyAction } from "@reduxjs/toolkit";
import { checkBlockStatus } from "../../thunks/userThunks"
import { ThunkDispatch } from 'redux-thunk';


interface OptionType {
    value: string;
    label: string;
    imageSrc: string;
  }

interface CustomOptionProps {
    innerProps: React.HTMLProps<HTMLDivElement>;
    label: string;
    data: OptionType;
  }

const CustomOption: React.FC<CustomOptionProps> = ({
    innerProps,
    label,
    data,
  }) => (
    <div {...innerProps} className="flex items-center w-96" >
      <img
        src={data.imageSrc}
        alt={label}
        className="w-8 mr-2"
      />
      {label}
    </div>
  );
const EditProfilePage:React.FC=()=>{

    const {userInfo}=useSelector((state:RootState)=>state.auth)
    const navigate=useNavigate()
    const dispatch=useDispatch()

    const [name,setName]=useState(userInfo?.name)
    const [email,setEmail]=useState(userInfo?.email)
    const [language,setLanguage]=useState('')
    const [country,setCountry]=useState('')
    const [password,setPassword]=useState('')
    const [confirmPassword,setConfirmPassword]=useState('')

    const [nameError,setNameError]=useState('')
    const [emailError,setEmailError]=useState('')
    const [passwordError,setPasswordError]=useState<string|undefined>('')
    const [confirmError,setConfirmError]=useState<string|undefined>('')

    const [languages,setLanguages]=useState([])
    const [countries,setCountries]=useState([])
  

    const [imageSettingBoxOpen,setImageSettingBoxOpen]=useState(false)
    const [photo,setPhoto]=useState<undefined|string|unknown>(undefined)
    const [selectedPhoto,setSelectedPhoto]=useState('')
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);

    const [getAllCountries]=useGetAllCountriesMutation()
    const getCountries=useCallback(async()=>{
      try{
         const response=await getAllCountries({token:userInfo?.token}).unwrap()
         setCountries(response.countries)
  
      }catch(error){
          console.log(error)
      }
  },[getAllCountries,userInfo])
    
    const CountryOptions = (countries as { country: string; flag: string }[])?.map((country) => ({
      value: country.country,
      label: country.country,
      imageSrc: `${country.flag}`,
    }));
  
    const [getAllLanguages]=useGetAllLanguagesMutation()
    const getLanguages=useCallback(async()=>{
      try{
         const response=await getAllLanguages({token:userInfo?.token}).unwrap()
         setLanguages(response.languages)
  
      }catch(error){
          console.log(error)
      }
  },[getAllLanguages,userInfo])

    useEffect(()=>{
       setPhoto(`${userInfo?.photo.url}`) 
      getLanguages()
      getCountries()
    },[userInfo,getCountries,getLanguages])
   
  
    const languageOptions = (languages as { language: string; flag: string }[])?.map((language) => ({
      value: language.language,
      label: language.language,
      imageSrc: `${language.flag}`,
    }));
    

        const handleCountry = (selectedOption: OptionType | null) => {
        console.log(selectedOption?.value)
          setCountry(selectedOption?.value ?? '');
        };
      
        const handleLanguage = (selectedOption: OptionType | null) => {
          console.log(selectedOption?.value)
          setLanguage(selectedOption?.value ?? '');
        };


  const onCropComplete = (_croppedAreaPercentage:Area, croppedAreaPixels:Area) => {
    setCroppedArea(croppedAreaPixels);
}; 
 
  const handlePhotoSelect=(e: ChangeEvent<HTMLInputElement>)=>{
    
    const file = e?.target?.files?.[0];
     if(file){
      const imageUrl = URL.createObjectURL(file);
      setSelectedPhoto(imageUrl)
     }
    
    setImageSettingBoxOpen(true)
  }

  const handleDoneCrop=async()=>{ 
    if (croppedArea && selectedPhoto) {  
          const croppedImage = await getCroppedImg(selectedPhoto, croppedArea);
          setPhoto(croppedImage)
          setImageSettingBoxOpen(false);
  }
  }
 const [editProfile]=useEditProfileMutation()
  const handleSave=async()=>{
    try{
      const token=userInfo?.token
      const response=await editProfile({token,datas:{photo,name,email,country,language,password}}).unwrap()
                  
                    dispatch(setCredentials({token:userInfo?.token,...response.updatedInfo}))
                    navigate('/profilepage',{ state: { user:'Me' } })
    }catch(error){
      console.error(error)
    }
  }

    function validateName(event: React.ChangeEvent<HTMLInputElement>) {
        const inputField = event.target;
        const regex = /^[A-Za-z]+$/;
        const value = inputField.value;
      
        if (!regex.test(value)) {
          inputField.value = value.slice(0, -1);
        }
      }

    const handleName=(e: React.ChangeEvent<HTMLInputElement>)=>{
      if(e.target.value.length < 5 ){
        setNameError('Name should be atleast 5 letters')
      }else{
        setNameError('')
      }
        setName(e.target.value) 
    }

     const handleEmail=(e: React.ChangeEvent<HTMLInputElement>)=>{
      if(e.target.value.length < 5 ){
        setEmailError('Name should be atleast 5 Characters long')
      }else{
        setEmailError('')
      }
        setEmail(e.target.value) 
    }

    function validatePassword(event: React.ChangeEvent<HTMLInputElement>) {
        const inputField = event.target;
        const regex = /^[A-Za-z0-9]+$/;
        const value = inputField.value;
      
        if (!regex.test(value)) {
          inputField.value = value.slice(0, -1);
        }
      }
    const handlePassword=(e: React.ChangeEvent<HTMLInputElement>)=>{      
        if(password?.length < 5 ){
          setPasswordError('Password should be atleast 5 characters long')
        }else if(!/[a-zA-Z]{3,}/.test(e.target.value)){
          setPasswordError('Password should contain atleast 3 letters')
        }else{
          setPasswordError(undefined)
          if(password!=confirmPassword){
            setConfirmError('Confirm your password')
         } 
        }
        setPassword(e.target.value)
      }

      const handleConfirmPassword=(e: React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.value != password){
          setConfirmError('Passwords should match')
        }else{
          setConfirmError(undefined)
        }
        setConfirmPassword(e.target.value) 
      }

      const {logout:auth0Logout}=useAuth0()
      const dispatchThunk = useDispatch<ThunkDispatch<RootState, ExtraArgumentType, AnyAction>>();

      useEffect(()=>{
        if(!userInfo){
            navigate('/')
        }else if(userInfo?.isProfileFinished===false){
            navigate('/finishprofilepage')
        }else{
          dispatchThunk(checkBlockStatus(userInfo,userInfo?.token,navigate,auth0Logout))       
        }
    },[auth0Logout,dispatchThunk,navigate,userInfo,photo,name,email,password,confirmPassword,country,language])

    return(
        <div className="w-screen  h-screen flex flex-col  md:flex-row ">
                <div className="fixed w-screen h-[8%] top-0 md:hidden">
                <HeadMobile pagename='Profile'/>
                </div> 
                <div className="hidden md:block md:w-[20%] md:h-screen">
                <MenuBar pagename='Profile'/>
                </div>
                <div className="container flex w-full h-full py-[20%] md:py-[3%] ">
                    <div className="w-full h-full space-y-10 md:space-y-10 overflow-y-scroll md:overflow-hidden">
                        <div className="flex space-x-2 items-center">
                        {/* <img  className="w-12 h-12" src="/assets/icons/icons8-back-64.png" alt=""/> */}
                        <h1 className="font-semibold md:font-bold text-lg md:text-2xl">Edit Profile</h1>
                        </div>
                        {/* photo name email */}
                        <div className="flex flex-col md:flex-row space-y-2 md:space-x-10 w-full md:h-[40%] items-center justify-center ">

                            {/* photo */}
                        <div className="flex flex-col items-center  justify-center">

                {
                  typeof photo ==='string' ?
                  <img className="w-36 h-36 md:w-48 md:h-48 rounded-full" src={photo} alt="" />
                  :
                  <div className="w-32 h-32 rounded-full bg-slate-300 flex justify-center items-center">
                    <img className="w-3/6 h-3/6" src="/assets/icons/icons8-add-image-48.png" alt=""/>
                   </div>
                 }

                <div className="bg-slate-200 w-28 rounded-xl p-2 relative hover:bg-slate-300">
                    <h1 className="cursor-pointer text-sm font-semibold">
                      Choose Image
                      <input
                        type="file"
                        onChange={handlePhotoSelect}
                        className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                      />
                    </h1>
                    {/* <img src={photo} alt="" /> */}
                  </div>
                                    
            </div>
            {
                imageSettingBoxOpen && 
                    <div className="fixed p-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-black z-10 space-y-2 w-[90%] md:w-[50%] h-[60%] bg-white">
                       {selectedPhoto && (
                <div style={{ position: 'relative', width: '100%', height: '90%' }}>
                    <ReactCrop 
                        image={selectedPhoto}
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 3}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
            )}
            <div className="w-full flex justify-between">
            <button onClick={()=>setImageSettingBoxOpen(false)} className="bg-red-500  font-semibold text-sm py-1 px-2 text-white rounded-md">Cancel</button>
            <button onClick={handleDoneCrop} className="bg-blue-600  font-semibold text-sm py-1 px-2 text-white rounded-md">Done</button>
            </div>
                    </div>
              }
            {/* name email */}
            <div className="w-full flex flex-col space-y-2 md:space-y-4  ">
                <div className="flex flex-col ">
                <label className="font-semibold" >Name</label>
                 <input  onChange={handleName} onInput={validateName} type="text" className="w-full md:w-[70%] h-10 border-2 px-3 rounded-lg " value={name} placeholder="Enter Name" />
                 {
                    nameError && <p className="text-xs text-red-500" >{nameError}</p>               
                 }
                </div>
                <div className="flex flex-col">
                <label className="font-semibold" >Email</label>
                 <input onChange={handleEmail} type="email" className="w-full md:w-[70%] h-10 border-2 px-3 rounded-lg " value={email} placeholder="Enter Email" />
                 {
                    emailError && <p className="text-xs text-red-500" >{emailError}</p>               
                 }
                 </div> 

            </div>
                        </div>

                        {/* language country */}
                        <div className="flex flex-col md:flex-row space-y-2 md:space-x-10 w-full items-center justify-center ">
                            <div className="flex flex-col w-full md:w-1/2 ">
                            <label className="text-sm font-semibold md:text:md md:font-semibold">Your Country</label>
                            <Select
                            className="border  rounded-lg"
                            options={CountryOptions}
                            components={{ Option: CustomOption }}
                            isSearchable={true}
                             onChange={handleCountry}
                            />
                            </div>
                            <div className="flex flex-col w-full md:w-1/2  ">
                            <label className="text-sm font-semibold md:text:md md:font-semibold">Language you are most fluent in:-</label>
                            <Select
                            className="border  rounded-lg"
                            options={languageOptions}
                            components={{ Option: CustomOption }}
                            isSearchable={true}
                            onChange={handleLanguage}
                            />
                            </div>
                      
                        </div>
                   
                   {/* password */}
                         <div className="flex flex-col md:flex-row space-y-2 md:space-x-10 w-full ">
                         <div className="flex flex-col w-full md:w-1/2 ">
                            <label className="text-sm font-semibold md:text:md md:font-semibold">New password</label>
                            <input className="border-2  rounded-lg h-10 px-3" onChange={handlePassword} onInput={validatePassword} value={password} placeholder="Enter new password" />
                            {
                              passwordError && <p className="text-xs text-red-500" >{passwordError}</p>               
                            }
                            </div>
                            <div className="flex flex-col w-full md:w-1/2 ">
                            <label className="text-sm font-semibold md:text:md md:font-semibold">Confirm new password</label>
                            <input className="border-2  rounded-lg h-10 px-3" onChange={handleConfirmPassword}  value={confirmPassword} placeholder="Confirm new password" />
                            {
                              confirmError && <p className="text-xs text-red-500" >{confirmError}</p>               
                            }
                            </div>
                         </div>
                      
                      {/* save button */}
                      {
                        nameError || emailError || passwordError || confirmError ?
                        <button  className="bg-green-400 text-white rounded-xl p-1.5 border-2 cursor-not-allowed " >Save Changes</button>
                        :
                        <button onClick={handleSave} className="bg-green-400 text-white rounded-xl p-1.5 border-2 hover:bg-green-600" >Save Changes</button>
                      }
                    </div>
                    
                    </div>
                
                <div className="fixed w-screen h-[8%] bottom-0 md:hidden">
                <FootMobile pagename='Profile' />
                </div>
     </div>
    )
}
export default EditProfilePage