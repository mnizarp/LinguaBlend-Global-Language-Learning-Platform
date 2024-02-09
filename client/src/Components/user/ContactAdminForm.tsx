import  { useState } from 'react'
import { useContactAdminMutation } from '../../slices/usersApiSlice'

interface ContactAdminFormProps{
    setContactAdminOpen:React.Dispatch<React.SetStateAction<boolean>>
}

const ContactAdminForm:React.FC<ContactAdminFormProps>=({setContactAdminOpen})=> {
    const [username,setUsername]=useState('')
    const [useremail,setUseremail]=useState('')
    const [content,setContent]=useState('')
    
    const [contactAdmin]=useContactAdminMutation()

    const handleSend=async()=>{
        try {
            contactAdmin({userName:username,userEmail:useremail,content})
            setContactAdminOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleClose=async()=>{
        setContactAdminOpen(false)
    }
  return (
   
    <div className="flex justify-center items-center fixed inset-0 z-50 bg-gray-500 bg-opacity-50">
    <div className="w-64 md:w-96 bg-white rounded-lg shadow-lg p-6 relative">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        aria-label="Close modal"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <h2 className="text-xl font-semibold mb-4">Contact Admin</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input onChange={(e)=>setUsername(e.target.value)} value={username} type="text" id="username" name="username" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter your username" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input onChange={(e)=>setUseremail(e.target.value)} value={useremail} type="email" id="email" name="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter your email address" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea onChange={(e)=>setContent(e.target.value)} value={content} id="message" name="message"  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter your message"></textarea>
        </div>
        {
            username && useremail && content ?
            <button onClick={handleSend}  className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send</button>
             :
            <button   className=" cursor-not-allowed w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send</button>
  
        }
      </div>
    </div>
  </div>
  

  )
}

export default ContactAdminForm