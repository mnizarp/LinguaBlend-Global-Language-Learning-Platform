import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice'
import sessionReducer from '../slices/sessionSlice'
import adminReducer from '../slices/adminSlice'
import { apiSlice } from '../slices/apiSlice'
import { checkBlockStatus } from '../thunks/userThunks'

// const store= configureStore({
//     reducer:{
//        auth:authReducer,
//        [apiSlice.reducerPath]:apiSlice.reducer,
//        session:sessionReducer,
//        admin:adminReducer
//     },
   
//     middleware:(getDefaultMiddleware)=> getDefaultMiddleware({
//         thunk: {
//             extraArgument: {
//               checkBlockStatus,
//             },
//           },
//     }).concat(apiSlice.middleware),
//     devTools:true
// })

// export default store


const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    session: sessionReducer,
    admin: adminReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: {
        checkBlockStatus,
      },
    },
  }).concat(apiSlice.middleware),
  devTools: true
});

export default store