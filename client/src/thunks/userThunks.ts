
import axios from 'axios';
import {logout} from '../slices/authSlice'
import { BASE_URL } from '../constants';
import { useNavigate } from 'react-router-dom';
// import { Dispatch } from 'redux'; 
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store/rootReducer';

type UserInfoType = {
  isGoogleLogin: boolean;
};

// type ExtraArgumentType = {
//   checkBlockStatus: typeof checkBlockStatus; // Add any other thunks or functions you need
// };

export interface ExtraArgumentType {
  checkBlockStatus: (userInfo: UserInfoType, token: string, navigate: ReturnType<typeof useNavigate>, auth0Logout: () => void) => ThunkAction<void, RootState, unknown, AnyAction>;
  // Add any other thunks or functions you need
}

// export const checkBlockStatus = (userInfo:UserInfoType,token:string, navigate:ReturnType<typeof useNavigate>,auth0Logout:() => void) => async (dispatch: Dispatch<AnyAction>) => {
  export const checkBlockStatus = (userInfo: UserInfoType, token: string, navigate: ReturnType<typeof useNavigate>, auth0Logout: () => void): ThunkAction<Promise<void>, RootState, ExtraArgumentType, AnyAction> => async (dispatch: ThunkDispatch<RootState, ExtraArgumentType, AnyAction>) => {

try {
    const response = await axios.get(`${BASE_URL}users/getuserblockstatus`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      if (response.data.blockStatus === true) {
        if(userInfo?.isGoogleLogin){
            await auth0Logout()
            return
          } 
        dispatch(logout());
        navigate('/');
      }
    }
  } catch (error) {
    console.log(error);
  }
};
