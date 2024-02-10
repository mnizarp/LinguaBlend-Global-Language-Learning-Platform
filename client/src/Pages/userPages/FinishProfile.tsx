

import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ReactCrop,{Area} from 'react-easy-crop';
import Select from 'react-select';
import { setCredentials } from "../../slices/authSlice";
// import { useFinishprofileMutation } from "../../slices/usersApiSlice";
import toast, { Toaster } from "react-hot-toast";
import getCroppedImg from "../../utils/getCroppedImg";
import { RootState } from "../../store/rootReducer";
import { useGetAllCountriesMutation, useGetAllLanguagesMutation } from "../../slices/adminApiSlice";
import { useFinishProfileMutation } from "../../slices/usersApiSlice";
import ReactLoading from "react-loading";


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



const FinishProfile:React.FC=()=>{

  const {userInfo}=useSelector((state:RootState)=>state.auth)
  const navigate=useNavigate()
  const dispatch=useDispatch()
  // const [finishprofile]=useFinishprofileMutation()

  useEffect(()=>{
    if(userInfo){
      if(userInfo.isProfileFinished===true){
        navigate('/home')
      }else{
        navigate('/finishprofilepage')
      }
    }else{
      navigate('/')
    }
  },[navigate,userInfo])

  const [language,setLanguage]=useState('')
  const [country,setCountry]=useState('')
  const [languages,setLanguages]=useState([])
  const [countries,setCountries]=useState([])

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
    getLanguages()
    getCountries()
  },[getCountries,getLanguages])
 

  const languageOptions = (languages as { language: string; flag: string }[])?.map((language) => ({
    value: language.language,
    label: language.language,
    imageSrc: `${language.flag}`,
  }));
  
const handleCountry = (selectedOption: OptionType | null) => {
    setCountry(selectedOption?.value ?? '');
  };

  const handleLanguage = (selectedOption: OptionType | null) => {
    setLanguage(selectedOption?.value ?? '');
  };

  const [loading,setLoading]=useState(false)

  const [finishProfile]=useFinishProfileMutation()
  const handleSubmit=async()=>{
    try{
      setLoading(true)
      const response=await finishProfile({token:userInfo?.token,datas:{photo,language,country,userId:userInfo?._id}}).unwrap()
          dispatch(setCredentials({...userInfo,...response}))
          setLoading(false)
          navigate('/home')

  }catch(error){
    console.log(error)
    setLoading(false)
    toast.error('Profile Not Completed')
  }  
  }

  
  const [imageSettingBoxOpen,setImageSettingBoxOpen]=useState(false)
  const [photo,setPhoto]=useState<undefined|string|unknown>(undefined)
  const [selectedPhoto,setSelectedPhoto]=useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

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
  
    return (
        <div className="w-full h-screen p-1 md:p-3 space-y-6 md:space-y-14">
          <Toaster/>
          {
            loading ?
            <div className="  flex flex-col justify-center items-center  fixed  inset-0 z-50  bg-opacity-50 ">
           <div className=" w-56 md:w-96 h-40 md:h-48 bg-white flex flex-col justify-center items-center">
            <ReactLoading
                type="spinningBubbles"
                color="#0000FF"
                height={100}
                width={50}
            />
            <h1 className="font-semibold text-md">Please Wait while loading</h1>
            </div>
            </div>
          :
          <>
            <div className="flex items-center">
                <img className="w-[15%] h-[4%] md:w-[4%] md:h-[4%]" src="/assets/lb-removebg-previewhh.png" alt="" />
                <img className="w-[30%] h-[30%] md:w-[10%] md:h-[4%] ml-2" src="/assets/lb-removebg-preview.png" alt="" />               
             </div>
            <div className="container space-y-10 md:space-y-13 flex flex-col items-center ">
              
              
             <div className="flex flex-col items-center 
                             md:flex-row ">
                <h1 className="font-sans font-bold text-lg md:text-3xl">Hi {userInfo?.name}, </h1>
                <h1 className="font-sans font-bold md:text-3xl">Finish setting up your profile</h1>
             </div>
            <div className="flex flex-col items-center space-y-2 justify-center">
                 {/* {
                  photo ?
                  <img className="w-32 h-32 rounded-full" src={photo} alt=""/>
                  :
                  <div className="w-32 h-32 rounded-full bg-slate-300 flex justify-center items-center">
                     <img className="w-3/6 h-3/6" src="/assets/icons/icons8-add-image-48.png" alt=""/>
                   </div>
                 } */}

                {
                  typeof photo ==='string' ?
                  <img className="w-32 h-32 object-cover rounded-full" src={photo} alt=""/>
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
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                      />
                    </h1>
                  
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
             
             <div className="space-y-5 flex flex-col items-center">
                <div className="flex flex-col w-full">
                    <label className="text-sm font-semibold md:text:md md:font-bold">Your Country</label>
                       <Select
                        options={CountryOptions}
                        components={{ Option: CustomOption }}
                        isSearchable={true}
                        onChange={handleCountry}
                        />
                </div>
                <div className="flex flex-col w-full">
                    <label className="text-sm font-semibold md:text:md md:font-bold">Language you are most fluent in:-</label>
                       <Select
                        options={languageOptions}
                        components={{ Option: CustomOption }}
                        isSearchable={true}
                        onChange={handleLanguage}
                        />
                </div>
                {
                  photo && language && country  ?
                 
                  <button className="bg-green-400 text-white font-semibold w-2/4 rounded-md" onClick={handleSubmit}>
                  Finish
                  </button>
                  :
                  <button className="bg-green-400 text-white font-semibold w-2/4 cursor-not-allowed rounded-md" >
                  Finish
                  </button>
                }
              
             </div>
          
             <div className="w-full flex flex-col ">
             <hr className="border w-full border-black opacity-20  "/>
             <p className="text-sm">Contact us:-</p>
             <p className="text-xs">www.linguablend.com</p>
             <p className="text-xs">linguablendofficial@gmail.com</p>
             </div>
            </div>  
            </>
          }       
        </div>
    )
}
export default FinishProfile