import { useNavigate } from "react-router-dom"
import { PHOTO_BASE_URL } from "../../constants"

interface SuggestionProps{
  suggestion:{
    _id:string
    photo:{
      url:string
    }
    name:string
    language_id:{
      language:string
      flag:string
    }
  }
}

const Suggestion=({suggestion}:SuggestionProps)=> {

  const navigate=useNavigate()

  return (
    <div className="w-full h-16 flex items-center justify-between bg-slate-50 rounded-md">
       <div className="flex space-x-2 items-center">
           <img onClick={()=> navigate('/profilepage',{ state: { user:suggestion?._id } })} className="rounded-full cursor-pointer w-10 h-10" src={suggestion?.photo?.url} alt=""/>
           <div className="">
            <h1 className="font-semibold">{suggestion.name}</h1>
            <div className="flex items-center">
             <h1 className="text-xs">{suggestion.language_id.language}</h1>
             <img className="w-3 h-3" src={`${PHOTO_BASE_URL}${suggestion.language_id.flag}`} alt=""/>
            </div>          
           </div>
       </div>
       <button onClick={()=> navigate('/profilepage',{ state: { user:suggestion?._id } })} className="bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded-lg m-2">View Profile</button>
    </div>
  )
}

export default Suggestion