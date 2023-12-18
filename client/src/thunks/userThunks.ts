
import axios from 'axios';
import {logout} from '../slices/authSlice'
import { BASE_URL } from '../constants';
import { useNavigate } from 'react-router-dom';


type UserInfoType = {
  isGoogleLogin: boolean;
};

export const checkBlockStatus = (userInfo:UserInfoType,token:string, navigate:ReturnType<typeof useNavigate>,auth0Logout) => async (dispatch) => {
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
