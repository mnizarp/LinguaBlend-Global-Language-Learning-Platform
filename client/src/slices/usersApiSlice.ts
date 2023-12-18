import { apiSlice } from "./apiSlice";

const USERS_URL='/api/users'

export const usersApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        login:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/login`,
                method:'POST',
                body:data
            })
        }),
        signup:builder.mutation({
         query:(data)=>({
            url:`${USERS_URL}/signup`,
            method:'POST',
            body:data
         })
        }),
        finishProfile:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/finishprofile`,
                method:'PATCH',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        logout:builder.mutation({
            query:()=>({
                url:`${USERS_URL}/logout`,
                method:'POST'
            })
        }),
        addPost:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/addpost`,
                method:'POST',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        editComment:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/editcomment`,
                method:'PATCH',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),deletePost:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/deletepost`,
                method:'PATCH',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getUnreadNotifications:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/getunreadnotifications`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getUserDetails:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/getuserdetails?userId=${data.userId}`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        likeUnlike:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/likeunlike`,
                method:'PATCH',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        addComment:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/addcomment`,
                method:'POST',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getComments:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/getcomments`,
                method:'POST',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        editPost:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/editpost`,
                method:'PATCH',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        reportPost:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/reportpost`,
                method:'POST',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        editProfile:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/editprofile`,
                method:'PATCH',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getPosts:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/getposts`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        userSearch:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/searchusers?search=${data.searchInput}`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        signupWithGoogle:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/signupwithgoogle`,
                method:'POST',
                body:data,
            })
        }),
        getAllSuggestions:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/getsuggestions`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getAllNotifications:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/getnotifications`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        clearAllUnreadNotifications:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/clearunreadnotifications`,
                method:'PATCH',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getProfilePosts:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/getposts?userId=${data.userId}`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        followUnfollow:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/followunfollow`,
                method:'PATCH',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        reportUser:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/reportuser`,
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
    useLoginMutation,
    useSignupMutation,
    useLogoutMutation,
    useFinishProfileMutation,
    useAddPostMutation,
    useEditCommentMutation,
    useDeletePostMutation,
    useGetUnreadNotificationsMutation,
    useGetUserDetailsMutation,
    useLikeUnlikeMutation,
    useAddCommentMutation,
    useGetCommentsMutation,
    useEditPostMutation,
    useReportPostMutation,
    useEditProfileMutation,
    useGetPostsMutation,
    useUserSearchMutation,
    useSignupWithGoogleMutation,
    useGetAllSuggestionsMutation,
    useGetAllNotificationsMutation,
    useClearAllUnreadNotificationsMutation,
    useGetProfilePostsMutation,
    useFollowUnfollowMutation,
    useReportUserMutation
}=usersApiSlice
