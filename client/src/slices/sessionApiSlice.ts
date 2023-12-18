import { apiSlice } from "./apiSlice";

const SESSION_URL='/api/session'

export const sessionApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({     
        createSession: builder.mutation({
            query: (data) =>({
                url:`${SESSION_URL}/createsession`,
                method:'POST',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
          }),
          deleteSession:builder.mutation({
            query:(data)=>({
                url:`${SESSION_URL}/deletesession`,
                method:'DELETE',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }  
            })
          }),
          leaveSession:builder.mutation({
            query:(data)=>({
                url:`${SESSION_URL}/leavesession`,
                method:'PATCH',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
          }),
          sendSessionMessage:builder.mutation({
            query:(data)=>({
                url:`${SESSION_URL}/sendsessionmessage`,
                method:'POST',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
          }),
          getAllSessionMessages:builder.mutation({
            query:(data)=>({
                url:`${SESSION_URL}/getsessionmessages`,
                method:'POST',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
          }),
          getSessionAllMembers:builder.mutation({
            query:(data)=>({
                url:`${SESSION_URL}/getsessionmembers`,
                method:'POST',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
          })
        })
    })


export const {
    useCreateSessionMutation,
    useDeleteSessionMutation,
    useLeaveSessionMutation,
    useSendSessionMessageMutation,
    useGetAllSessionMessagesMutation,
    useGetSessionAllMembersMutation
    
}=sessionApiSlice