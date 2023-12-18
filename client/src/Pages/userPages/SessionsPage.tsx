import  { useCallback, useEffect, useState } from 'react'
import HeadMobile from '../../Components/user/HeadMoblile'
import MenuBar from '../../Components/user/MenuBar'
import FootMobile from '../../Components/user/FootMobile'
import AddSession from '../../Components/user/AddSession'
import SessionBox from './SessionBox'
import JoinSessionConfirm from '../../Components/user/JoinSessionConfirm'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL, PHOTO_BASE_URL } from '../../constants'
import { saveSession } from '../../slices/sessionSlice'
import { RootState } from '../../store/rootReducer'

const SessionsPage = () => {
    const {userInfo}=useSelector((state:RootState)=>state.auth)
    const {sessionInfo}=useSelector((state:RootState)=>state.session)
    const [sessionBoxOpen,setSessionBoxOpen]=useState(false)
       
    const dispatch=useDispatch()

    useEffect(()=>{
      if(sessionInfo){
        setSessionBoxOpen(true)
      }
    },[sessionInfo])

    
    const [joinConfirmBoxOpen,SetJoinConfirmBoxOpen]=useState(false)
    const [allSessions,SetAllSessions]=useState([])

    const handleSessionClick=async(sessionId:string)=>{
      // SetJoinConfirmBoxOpen(true)
      try {
        const token=userInfo?.token
        const response=await axios.patch(`${BASE_URL}session/joinsession`,{
          sessionId
        },{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
        // console.log(response?.data?.sessiondetails)
        dispatch(saveSession({...response?.data?.sessiondetails}))
      } catch (error) {
        console.log(error)
      }

    }
    const getAllSessions=useCallback(async()=>{
      try {
          const token=userInfo?.token
          const response=await axios.get(`${BASE_URL}session/getsessions`,{
              headers:{
                  Authorization:`Bearer ${token}`
              }
          })
          SetAllSessions(response.data.allsessions)
      } catch (error) {
          console.log(error)
      }
  }
,[userInfo])

    useEffect(()=>{
      getAllSessions()
    },[sessionBoxOpen,getAllSessions])

    interface Session{
      _id:string
      language:{
        language:string
        flag:string
      }
      title:string
      difficulty:string
    }


return (
  <>
    {!sessionBoxOpen ? (
      <div className="w-screen h-screen flex flex-col md:flex-row">
        <div className="w-screen h-[8%] md:hidden">
          <HeadMobile pagename="Sessions" />
        </div>
        <div className="hidden md:block md:w-[18%] md:h-screen">
          <MenuBar pagename="Sessions" />
        </div>

        <div className="space-y-3 md:space-y-10 h-full flex flex-col items-center w-full md:w-[82%] py-[8%] px-[5%] md:p-5">
          <AddSession />

          <div className="w-full h-[70%] md:h-[86%] overflow-y-scroll flex flex-wrap">
            {allSessions.map((session: Session) => (
              <div
                key={session._id}
                onClick={() => handleSessionClick(session._id)}
                className="w-full md:w-[30%] h-[17%] border-2 border-black rounded-lg m-1 flex space-x-2 cursor-pointer"
              >
                <div className="w-[25%] h-full flex flex-col items-center justify-center">
                  <img className="w-10 h-10" src={`${PHOTO_BASE_URL}${session.language?.flag}`} alt="" />
                  <h1 className="text-sm font-semibold">{session.language.language}</h1>
                </div>
                <div className="w-[75%] h-full flex flex-col justify-center">
                  <h1 className="text-xl font-bold">{session?.title}</h1>
                  <div className="bg-green-500 rounded-full w-max px-2">
                    <h1 className="text-white text-xs">{session?.difficulty}</h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {allSessions.length === 0 && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-lg font-semibold text-gray-500">No sessions available.</p>
            </div>
          )}

          {joinConfirmBoxOpen && <JoinSessionConfirm setJoinConfirmBoxOpen={SetJoinConfirmBoxOpen} setSessionBoxOpen={setSessionBoxOpen} />}
        </div>

        <div className="w-screen h-[8%] md:hidden">
          <FootMobile pagename="Sessions" />
        </div>
      </div>
    ) : (
      <SessionBox setSessionBoxOpen={setSessionBoxOpen} />
    )}
    <style>
      {`
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-thumb {
          background-color: #cccccc;
          border-radius: 6px;
        }

        ::-webkit-scrollbar-track {
          background-color: #f1f1f1;
        }
      `}
    </style>
  </>
)


}

export default SessionsPage