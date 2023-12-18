import {createSlice} from '@reduxjs/toolkit'

const storedAdminInfo = sessionStorage.getItem('adminInfo');
const adminInfoString = storedAdminInfo || ''; 

const adminInfo = storedAdminInfo ? JSON.parse(adminInfoString) : null;

interface AppState {
    adminInfo: { _id:string,name:string,email:string,token:string } | null;
}


const initialState: AppState = {
    adminInfo,
};


const adminSlice=createSlice({
   name:'admin',
   initialState,
   reducers:{
     setAdminCredentials:(state:AppState,action)=>{
        state.adminInfo=action.payload
        sessionStorage.setItem('adminInfo',JSON.stringify(state.adminInfo))
     },
     adminLogout:(state)=>{
        state.adminInfo=null
        sessionStorage.removeItem('adminInfo')
        console.log('loggedout')
     },
    
   }
})

export const {setAdminCredentials,adminLogout}=adminSlice.actions

export default adminSlice.reducer


