import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import store from './store/store.ts'
import { Provider } from 'react-redux'
import {Auth0Provider} from '@auth0/auth0-react'
import { AUTH0_PROVIDER_CLIENTID, AUTH0_PROVIDER_DOMAIN } from './constants.ts'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    
    <Provider store={store}>
    <Auth0Provider
       domain={AUTH0_PROVIDER_DOMAIN}
       clientId={AUTH0_PROVIDER_CLIENTID}
       authorizationParams={{
        redirect_uri:window.location.origin
       }}
      >
           <App/>
       </Auth0Provider>  
    </Provider>
 
   </React.StrictMode>
)
