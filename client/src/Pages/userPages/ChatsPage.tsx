import  { useState } from 'react'
import HeadMobile from '../../Components/user/HeadMoblile'
import MenuBar from '../../Components/user/MenuBar'
import FootMobile from '../../Components/user/FootMobile'
import ChatList from '../../Components/user/ChatList'
import PersonalChatBox from '../../Components/user/PersonalChatBox'

const ChatsPage = () => {
    const [chatBox,setChatBox]=useState('')
  return (
    <div className="w-screen  h-screen flex flex-col  md:flex-row ">
    <div className=" w-screen h-[8%]  md:hidden">
    <HeadMobile pagename='Chats'/>
    </div> 
    <div className="hidden md:block md:w-[18%] md:h-screen">
    <MenuBar pagename='Chats'/>
    </div>


    <div className='h-[84%] md:h-full w-full md:w-[82%] flex '>
        {
            chatBox ?
               <>              
                <div className=' w-full md:w-1/2 h-full md:border-r hidden md:block '>
                  <ChatList setChatBox={setChatBox} chatBox={chatBox} />
                </div>
                <div className=' w-full md:w-1/2 h-full p-1 md:p-8'>
                  <PersonalChatBox setChatBox={setChatBox} chatBox={chatBox} />
                </div>
                </>
                :
                <>
                <div className=' w-full md:w-1/2 h-full md:border-r '>
                <ChatList setChatBox={setChatBox} chatBox={chatBox} />
                </div>
                <div className=' w-full md:w-1/2 h-full  hidden md:flex  md:justify-center md:items-center p-8 '>
                    <div className='border rounded-xl w-full h-full flex flex-col justify-center items-center'>
                    <div className='w-[50%] h-[40%] space-y-2 flex flex-col justify-center items-center '>
                           <div className='w-[70%] h-[70%] rounded-full bg-slate-50 flex justify-center items-center'>
                           <img className='w-[50%] h-[50%] opacity-90' src='/assets/icons/icons8-sms-32.png' alt=''/>
                           </div>                           
                           <h1 className='text-xs font-semibold'>Please select any chat to start chatting.</h1>
                       </div>
                    </div>                   
                </div>
                </>
        }
        
     </div>
    
          
    <div className=" w-screen h-[8%]  md:hidden">
    <FootMobile pagename='Chats' />
    </div>
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
</div>
  )
}

export default ChatsPage