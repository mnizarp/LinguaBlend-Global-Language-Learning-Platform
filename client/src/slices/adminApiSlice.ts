import { apiSlice } from "./apiSlice";

const ADMIN_URL='/api/admin'

export const adminApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        adminLogin:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/login`,
                method:'POST',
                body:data
            })
        }),
        getUserReports:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/getuserreports`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getPostReports:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/getpostreports`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getUserDetails_admin:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/getuserdetails?userId=${data.userId}`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getUserPosts_admin:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/getuserposts?userId=${data.userId}`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        userBlockUpdate:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/userblockupdate`,
                method:'PATCH',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getAllCountries:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/getcountries`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        postHideUpdate:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/posthideupdate`,
                method:'PATCH',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getAllLanguages:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/getlanguages`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        countryListUpdate:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/countrylistupdate`,
                method:'PATCH',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        languageListUpdate:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/languagelistupdate`,
                method:'PATCH',
                body:data.datas,
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getAllUsers:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/getusers`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getTrendingPosts:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/gettrendingposts`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getNewUsers:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/getnewusers`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getSessions:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/getsessions`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        }),
        getAllPosts:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/getallposts`,
                method:'GET',
                headers:{
                    Authorization:`Bearer ${data.token}`
                }
            })
        })

    })
})

export const {useAdminLoginMutation,
    useGetUserReportsMutation,
    useGetPostReportsMutation,
    useGetUserDetails_adminMutation,
    useGetUserPosts_adminMutation,
    useUserBlockUpdateMutation,
    useGetAllCountriesMutation,
    usePostHideUpdateMutation,
    useGetAllLanguagesMutation,
    useCountryListUpdateMutation,
    useLanguageListUpdateMutation,
    useGetAllUsersMutation,
    useGetTrendingPostsMutation,
    useGetNewUsersMutation,
    useGetSessionsMutation,
    useGetAllPostsMutation
}=adminApiSlice