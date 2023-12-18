import { useCallback, useEffect, useState } from "react"
import Header from "../../Components/admin/Header"
import { useGetAllCountriesMutation, useGetAllLanguagesMutation, useGetAllPostsMutation, useGetAllUsersMutation, useGetNewUsersMutation, useGetSessionsMutation, useGetTrendingPostsMutation } from "../../slices/adminApiSlice"
import { PHOTO_BASE_URL } from "../../constants"
import { useSelector } from "react-redux"
import { RootState } from "../../store/rootReducer"
import { useNavigate } from "react-router-dom"

interface Post{
   _id:string,
   user:{
      name:string
      photo:{
         url:string
      }
   },
   post_image:string
   caption:string
   likes:[]
}

interface User{
   name:string
   photo:{
      url:string
   }
}

interface Session{
   title:string
   language:{
      flag:string
   }
}

const Dashboard:React.FC=()=>{
   const {adminInfo}=useSelector((state:RootState)=>state.admin)
   const navigate=useNavigate()
   useEffect(()=>{
       if(!adminInfo){
          navigate('/admin')
       }
   },[adminInfo,navigate])
       const [trendingPosts,setTrendingPosts]=useState<Post[]>([])
       const [newUsers,setNewUsers]=useState<User[]>([])
       const [sessions,setSessions]=useState<Session[]>([])


       const [allUsers,setAllUsers]=useState([])
       const [allPosts,setAllPosts]=useState([])
       const [allCountries,setAllCountries]=useState([])
       const [allLanguages,setAllLanguages]=useState([])

       const [getTrendingPosts]=useGetTrendingPostsMutation()
       const [getNewUsers]=useGetNewUsersMutation()
       const [getSessions]=useGetSessionsMutation()
       const [getAllUsers]=useGetAllUsersMutation()
       const [getAllCountries]=useGetAllCountriesMutation()
       const [getAllLanguages]=useGetAllLanguagesMutation()
       const [getAllPosts]=useGetAllPostsMutation()

       const get_trending_posts=useCallback(async()=>{
              try{
               const response=await getTrendingPosts({token:adminInfo?.token}).unwrap()
               setTrendingPosts(response.trendingposts)
              }catch(error){
                     console.log(error)
              }
       },[getTrendingPosts,adminInfo])

       const get_new_users=useCallback(async()=>{
           try{
              const response=await getNewUsers({token:adminInfo?.token}).unwrap()
              setNewUsers(response.newusers)
           }catch(error){
              console.log(error)
           }
       },[getNewUsers,adminInfo])

       const get_sessions=useCallback(async()=>{
              try{
                const response=await getSessions({token:adminInfo?.token}).unwrap()
                console.log(response.allsessions)
                setSessions(response.allsessions)
              }catch(error){
                     console.log(error)
              }
       },[getSessions,adminInfo])

       const get_all_users=useCallback(async()=>{
              try {
                 const response=await getAllUsers({token:adminInfo?.token}).unwrap()
                 setAllUsers(response.allUsers)
              } catch (error) {
                     console.log(error)
              }
       },[getAllUsers,adminInfo])

       const get_all_countries=useCallback(async()=>{
              try {
                 const response=await getAllCountries({token:adminInfo?.token}).unwrap()
                 setAllCountries(response.countries)
              } catch (error) {
                     console.log(error)
              }
       },[getAllCountries,adminInfo])

       const get_all_languages=useCallback(async()=>{
              try {
                 const response=await getAllLanguages({token:adminInfo?.token}).unwrap()
                 setAllLanguages(response.languages)
              } catch (error) {
                     console.log(error)
              }
       },[getAllLanguages,adminInfo])

       const get_all_posts=useCallback(async()=>{
              try {
                 const response=await getAllPosts({token:adminInfo?.token}).unwrap()
                 setAllPosts(response.allposts)
              } catch (error) {
                     console.log(error)
              }
       },[getAllPosts,adminInfo])

       useEffect(()=>{
              get_trending_posts()
              get_new_users()
              get_sessions()
              get_all_users()
              get_all_countries()
              get_all_languages()
              get_all_posts()
       },[get_trending_posts,get_new_users,get_sessions,get_all_users,get_all_countries,get_all_languages,get_all_posts])

       return(
        <div className="w-screen h-screen overflow-x-hidden">
            <Header pagename="Dashboard" />
           <div className=" w-full h-full p-3 flex flex-col space-y-5 ">

              {/* First total cards */}
               <div className="w-full h-[25%] flex space-x-5 justify-center items-center">

                  <div className="w-[20%] h-[90%] bg-  border-2 border-black rounded-xl flex  items-center justify-center space-x-6">
                     <img className="w-16 h-16" src="/assets/icons/icons8-users-48.png" alt=""/>
                     <div className="flex flex-col items-center justify-center">
                       <h1 className="font-bold text-xl">Users</h1>
                       <h1 className="font-bold text-3xl">{allUsers?.length}</h1>
                     </div>
            
                  </div>


                  <div className="w-[20%] h-[90%]   border-2 border-black rounded-xl flex  items-center justify-center space-x-6">
                  <img className="w-14 h-14" src="/assets/icons/icons8-posts-60.png" alt=""/>
                    <div className="flex flex-col items-center justify-center">
                       <h1 className="font-bold text-xl">Posts</h1>
                       <h1 className="font-bold text-3xl">{allPosts?.length}</h1>
                     </div>
                  </div>


                  <div className="w-[20%] h-[90%]   border-2 border-black rounded-xl flex  items-center justify-center space-x-6">
                  <img className="w-16 h-16" src="/assets/icons/icons8-countries-64.png" alt=""/>
                    <div className="flex flex-col items-center justify-center">
                       <h1 className="font-bold text-xl">Countries</h1>
                       <h1 className="font-bold text-3xl">{allCountries?.length}</h1>
                     </div>
                  </div>


                  <div className="w-[20%] h-[90%]  border-2 border-black rounded-xl flex  items-center justify-center space-x-6">
                  <img className="w-16 h-16" src="/assets/icons/icons8-languages-48.png" alt=""/>
                     <div className="flex flex-col items-center justify-center">
                       <h1 className="font-bold text-xl">Languages</h1>
                       <h1 className="font-bold text-3xl">{allLanguages?.length}</h1>
                     </div>
                  </div>

               </div>

               {/* Second section */}
               <div className="w-full h-[75%] flex space-x-2">
                     {/* Trending posts */}
                        <div className="w-[55%] h-full flex flex-col  space-y-2 overflow-y-scroll">
                          <h1 className="text-2xl font-bold">Trending Posts</h1>
                          {
                             trendingPosts?.map((post)=>(
                                   <div className="w-full h-full space-y-3 border p-2 rounded-md">
                                       <div className="flex space-x-3 items-center">
                                          <img className="w-10 h-10 rounded-full" src={`${post?.user.photo.url}`} alt=""/>
                                          <div>
                                             <h1 className="text-lg font-semibold">{post?.user.name}</h1>     
                                             
                                           </div>
                                       </div>   
                                     <img className="w-full h-[70%]" src={`${post?.post_image}`} alt=""/>
                                     <div className="flex justify-between">
                                         <h1 className="font-semibold">{post?.likes.length} Likes</h1>   
                                     </div>
                                     <p>{post?.caption}</p>
                                   </div>
                                ))
                          }
                        </div>

                    {/* New Users */}
                        <div className="w-[40%] h-full space-y-1">
                            <h1 className="text-2xl font-bold">New Users</h1>
                            <div className="w-full h-[50%] border rounded-md p-2 space-y-1">
                                 { newUsers?.map((user)=>(
                                   <div className="w-full h-[19%] bg-slate-50 flex items-center px-2 space-x-3">
                                       <img className="w-7 h-7 rounded-full" src={user?.photo.url} alt=""/>
                                       <h1 className="font-semibold">{user?.name}</h1>
                                   </div>
                                   ))
                                 }
                            </div>
                            <h1 className="text-2xl font-bold">Active Sessions</h1>
                            <div className="w-full h-[50%] border rounded-md p-2 space-y-1 overflow-y-scroll">
                            {  sessions?.length>0 ? 
                            sessions?.map((session)=>(
                                  <div className="w-full h-[19%] bg-slate-50 flex items-center px-2 space-x-3">
                                       <img className="w-7 h-7 rounded-full" src={`${PHOTO_BASE_URL}${session.language.flag}`} alt=""/>
                                       <h1 className="font-semibold">{session.title}</h1>
                                   </div>
                                   ))
                                   :
                                   <div className="w-full h-[19%] bg-slate-50 flex items-center px-2 space-x-3">
                                       <h1 className="font-semibold">No Active sessions available</h1>
                                   </div>
                            }
                            </div>
                        </div>
               </div>
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
export default Dashboard

