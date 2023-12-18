
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import sessionReducer from '../slices/sessionSlice';
import adminReducer from '../slices/adminSlice'
import { apiSlice } from '../slices/apiSlice';  

const rootReducer = combineReducers({
  auth: authReducer,
  session: sessionReducer,
  admin:adminReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
