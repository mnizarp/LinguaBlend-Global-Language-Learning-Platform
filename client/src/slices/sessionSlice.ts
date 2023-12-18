import {createSlice} from '@reduxjs/toolkit'

const storedSessionInfo = sessionStorage.getItem('sessionInfo');
const sessionInfoString = storedSessionInfo || ''; 

const sessionInfo = storedSessionInfo ? JSON.parse(sessionInfoString) : null;

interface AppState {
    sessionInfo: { _id:string,host:string,title:string,difficulty:string,language:{flag:string,language:string} } | null;
}


const initialState: AppState = {
    sessionInfo,
};


const sessionSlice=createSlice({
   name:'session',
   initialState,
   reducers:{
     saveSession:(state:AppState,action)=>{
        state.sessionInfo=action.payload
        sessionStorage.setItem('sessionInfo',JSON.stringify(state.sessionInfo))
     },
     quitSession:(state)=>{
        state.sessionInfo=null
        sessionStorage.removeItem('sessionInfo')
     },
     
   }
})

export const {saveSession,quitSession}=sessionSlice.actions

export default sessionSlice.reducer


