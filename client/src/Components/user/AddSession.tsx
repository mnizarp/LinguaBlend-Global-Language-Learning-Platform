
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { saveSession } from '../../slices/sessionSlice';
import { useGetAllLanguagesMutation } from '../../slices/adminApiSlice';
import { RootState } from '../../store/rootReducer';
import { useCreateSessionMutation } from '../../slices/sessionApiSlice';

interface OptionType {
    value: string;
    label: string;
    imageSrc: string;
  }

  interface DifficultyOptionType {
    value:string,
    label:string
  }

interface CustomOptionProps {
    innerProps: React.HTMLProps<HTMLDivElement>;
    label: string;
    data: OptionType;
  }
 
  interface DifficultyCustomOptionProps {
    innerProps:React.HTMLProps<HTMLDivElement>;
    label:string;
    data:DifficultyOptionType
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

  const DifficultyCustomOption: React.FC<DifficultyCustomOptionProps> = ({
    innerProps,
    label,
  }) => (
    <div {...innerProps} className="flex items-center w-96" >
      {label}
    </div>
  );


const AddSession=()=> {
    const {userInfo}=useSelector((state:RootState)=>state.auth)
    const [title,setTitle]=useState('')
    const [language,setLanguage]=useState('')
    const [difficulty,setDifficulty]=useState('')
    const [languages,setLanguages]=useState([])
    const [difficulties]=useState(['Beginner','Intermediate','Expert'])

    const dispatch=useDispatch()
    const [getAllLanguages]=useGetAllLanguagesMutation()
      const getLanguages=useCallback(async()=>{
        try{
           const response=await getAllLanguages({}).unwrap()    
       setLanguages(response.languages)
    
        }catch(error){
            console.log(error)
        }
    },[getAllLanguages])

      useEffect(()=>{
        getLanguages()
      },[getLanguages])


      const LanguageOptions = (languages as { language: string; flag: string }[])?.map((language) => ({
        value: language?.language,
        label: language?.language,
        imageSrc: `${language?.flag}`,
      }));

      const DifficultyOptions = difficulties?.map((difficulty) => ({
        value: difficulty,
        label: difficulty,
      }));

      const handleLanguage = (selectedOption: OptionType | null) => {
        setLanguage(selectedOption?.value ?? '');
      };

      const handleDifficulty = (selectedOption: DifficultyOptionType | null) => {
        setDifficulty(selectedOption?.value  ?? '');
      };

      const [createSession]=useCreateSessionMutation()
      
      const handleCreateSession=async()=>{
        try{
            const token=userInfo?.token
            const response=await createSession({token,datas:{title,language,difficulty}}).unwrap()
            
            setLanguage('')
            setDifficulty('')
            setTitle('')
            dispatch(saveSession({...response?.newsession}))
        }catch(error){
            console.log(error)
        }
      }

  return (
    <div className=" w-full h-[30%] md:h-[12%] bg-slate-50 flex flex-col md:flex-row items-center  space-x-2 md:space-x-5 border-2 rounded-lg justify-center">
       <div className='flex w-full md:w-[50%] items-center space-x-2 md:space-x-5'>
        <div className='w-[55%] '>
            <label className="text-xs font-semibold ">Session Title</label>
            <input className='w-full h-10 border border-slate-300 placeholder:text-slate-400 rounded-md px-2' placeholder='Type here ...' onChange={(e)=>setTitle(e.target.value)} value={title} />
        </div>
       
      <div className='w-[40%]' >
        <label className="text-xs font-semibold ">Difficulty level</label>
            <Select          
                            className='w-full'
                            options={DifficultyOptions}
                            components={{ Option: DifficultyCustomOption }}
                            isSearchable={true}
                            onChange={handleDifficulty}
                            />
      </div>
      </div>
      <div className='flex w-full md:w-[50%] items-center md:space-x-5'>
      <div className='w-[75%] ' >
        <label className="text-xs font-semibold ">Language</label>
            <Select               
                            className='w-full'                  
                            options={LanguageOptions}
                            components={{ Option: CustomOption }}
                            isSearchable={true}
                            onChange={handleLanguage}
                            />
      </div>
{
  title && language && difficulty  ? 
  <img onClick={handleCreateSession} className='h-10 w-10 md:h-12 md:w-12 cursor-pointer' src='/assets/icons/icons8-create-50.png' alt=''/>
 :
 <img  className='h-10 w-10 md:h-12 md:w-12 cursor-not-allowed m-3' src='/assets/icons/icons8-create-50.png' alt=''/>

}
    </div> 
    </div>


  )
}

export default AddSession