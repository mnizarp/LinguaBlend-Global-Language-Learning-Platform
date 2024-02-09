import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const baseQuery=fetchBaseQuery({baseUrl:'http://localhost:9009'})

export const apiSlice=createApi({
    baseQuery,
    tagTypes:['User','Admin','Session','Chats'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endpoints:(_builder)=>({}),
})