import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const baseQuery=fetchBaseQuery({baseUrl:'https://linguablend.live'})

export const apiSlice=createApi({
    baseQuery,
    tagTypes:['User','Admin','Session','Chats'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endpoints:(_builder)=>({}),
})