import  { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { useGetChatUnreadMessagesMutation, useGetChatsMutation } from '../../slices/chatsApiSlice'

interface ChatListProps{
  setChatBox:React.Dispatch<React.SetStateAction<string>>,
  chatBox:string
}

const ChatList = ({setChatBox,chatBox}:ChatListProps) => {
    const {userInfo}=useSelector((state:RootState)=>state.auth)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [chats,setChats]=useState([] as any[])
    const [searchInput,setSearchInput]=useState('')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [filteredChats,setFilteredChats]=useState([] as any[])

    const [getChatUnreadMessages]=useGetChatUnreadMessagesMutation()

    const getUnreadMessages=useCallback(async(chatId:string)=>{
      try {
        const token=userInfo?.token
        const response=await getChatUnreadMessages({token,datas:{chatId}}).unwrap()
        return response
      } catch (error) {
        console.log(error)
      }
    },[getChatUnreadMessages,userInfo])

  interface Chat{
    users:[
      {
        _id:string
        name:string
        photo:{
          url:string
        },
      }
    ],
    latest_message:{
      content:string,
      createdAt:string
    },
    unreadMessages:{
      chatunreadmessages:[]
    }

  }

    const searchUsers = useCallback(() => {
      const regex = new RegExp(searchInput as string, 'i');
    
      const filterChats = chats?.filter((chat:Chat) => {
        if (chat && chat.users && chat.users[0]) {
          return regex.test(chat.users[0].name);
        }
        return false; 
      });  
      setFilteredChats(filterChats);
    },[chats,searchInput])

    
    useEffect(()=>{
            searchUsers()
    },[searchInput,searchUsers])

    const [getChats]=useGetChatsMutation()


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processResponse=useCallback(async(response: any)=> {
    const finalResponse=[...response]
    for (const element of finalResponse) {
      const updatedElement = { ...element };
      const unreadMessages = await getUnreadMessages(element._id);
      updatedElement.unreadMessages = unreadMessages;
      finalResponse[finalResponse.indexOf(element)] = updatedElement;
    }
    return finalResponse
  },[getUnreadMessages])

  const getAllChats=useCallback(async()=>{
    try{
       const token=userInfo?.token
       const response=await getChats({token}).unwrap()

      const finalResponse=await processResponse(response);

      
       setChats(finalResponse)
       setFilteredChats(finalResponse)
    }catch(error){
        console.log(error)
    }
},[userInfo?.token,getChats,processResponse])



    useEffect(()=>{
      getAllChats()
    },[getAllChats])

  return (
    <div className='w-full h-full flex flex-col' >
        <div className='w-full h-[10%] md:h-[10%] flex justify-start ps-2 items-center'>
           <h1 className='text-xl md:text-2xl font-bold'>Chats</h1>
        </div>
       <div className='w-full h-[10%] md:h-[10%] flex  items-center ps-2'>
           <div className='w-[93%] h-8 md:h-10 px-2 space-x-2 border border-gray-400 rounded-lg flex flex-row items-center'>
             <img className='w-6 h-6'  src='/assets/icons/icons8-search-50.png' alt=''/>
             <input onChange={(e)=>setSearchInput(e.target.value)} value={searchInput} className='h-full w-full focus:outline-none' placeholder='Search chats or people....' />
           </div>
       </div>
       <hr/>
       <div className='w-full h-[80%] overflow-y-scroll flex flex-col space-y-1 p-1'>
      
           {
            filteredChats?.length>0 ?
           filteredChats?.map((chat:Chat)=>(
                <div onClick={()=>setChatBox(chat.users[0]?._id)} className={`w-full h-16 flex items-center rounded-md p-2 justify-between ${chatBox==chat.users[0]?._id ? 'bg-blue-200' : 'bg-blue-50' }  hover:bg-blue-100`} >
                    <img className='w-10 h-10 rounded-full' src={`${chat?.users[0]?.photo.url}`} alt=''/>
                    <div className='w-[70%] md:w-[77%] '>
                       <h1 className='font-bold text-md'>{chat?.users[0]?.name}</h1>
                       <h1 className='text-xs'>{chat?.latest_message?.content}</h1>
                    </div>
                    <div className='w-[10%] flex flex-col items-center space-y-1 justify-center'>
                      {
                        chat?.latest_message && 
                        <h3 className='text-xs '>{new Date(chat.latest_message?.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true, })}</h3>

                      }
                       <div className='bg-green-300 rounded-full px-1 md:px-2 flex justify-center items-center'>
                        {
                          chat?.unreadMessages?.chatunreadmessages?.length >0 && 
                          <h2 className='text-white text-xs md:text-sm font-semibold '>{chat?.unreadMessages?.chatunreadmessages?.length}</h2>
                        }
                           
                       </div>
                    </div>
                </div>
            ))
            :
            <div className='w-full h-full flex justify-center items-center'>
                <div className='bg-slate-50 h-1/2 w-1/2 rounded-full flex flex-col justify-center items-center'>
                <img src='/assets/icons/icons8-no-messages-99.png' alt=''/>    
                <h1 className='font-semibold' >Chatlist empty</h1>
                </div>
            </div>
           }
          
       </div>
    </div>
  )
}

export default ChatList