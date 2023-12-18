import { apiSlice } from "./apiSlice";

const CHATS_URL='/api/chats'

export const chatsApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({     
        getChats: builder.mutation({
            query: (data) =>({
                url: `${CHATS_URL}/getchats`,
                method:'GET',
                headers:{
                    Authorization: `Bearer ${data.token}`
                }
            })
          }),
          getMessages:builder.mutation({
            query:(data)=>({
                url:`${CHATS_URL}/getmessages`,
                method:'POST',
                body:data,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
          }),
          sendMessage:builder.mutation({
            query:(data)=>({
                url:`${CHATS_URL}/sendmessage`,
                method:'POST',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
          }),
          getUnreadMessages:builder.mutation({
            query:(data)=>({
                url:`${CHATS_URL}/getunreadmessages`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getChatUnreadMessages:builder.mutation({
            query:(data)=>({
                url:`${CHATS_URL}/getchatunreadmessages`,
                method:'POST',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        clearUnreadMessages:builder.mutation({
            query:(data)=>({
                url:`${CHATS_URL}/clearunreadmessages`,
                method:'PATCH',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        })
        })
    })


export const {
useGetChatsMutation,
useGetMessagesMutation,
useSendMessageMutation,
useGetUnreadMessagesMutation,
useGetChatUnreadMessagesMutation,
useClearUnreadMessagesMutation

}=chatsApiSlice