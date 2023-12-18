import {createSlice} from '@reduxjs/toolkit'

const storedUserInfo = localStorage.getItem('userInfo');
const userInfoString = storedUserInfo || ''; 

const userInfo = storedUserInfo ? JSON.parse(userInfoString) : null;

interface AppState {
    userInfo: { _id:string,name:string,email:string,isGoogleLogin:boolean,photo:{url:string},isProfileFinished:boolean,token:string } | null;
}


const initialState: AppState = {
    userInfo,
};


const authSlice=createSlice({
   name:'auth',
   initialState,
   reducers:{
     setCredentials:(state:AppState,action)=>{
        state.userInfo=action.payload
        localStorage.setItem('userInfo',JSON.stringify(state.userInfo))
     },
     logout:(state)=>{
        state.userInfo=null
        localStorage.removeItem('userInfo')
        console.log('loggedout')
     },
    
   }
})

export const {setCredentials,logout}=authSlice.actions

export default authSlice.reducer


