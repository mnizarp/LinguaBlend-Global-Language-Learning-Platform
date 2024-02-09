import LoginPage from "./Pages/userPages/LoginPage"
import SignupPage from "./Pages/userPages/SignupPage"
import HomePage from "./Pages/userPages/HomePage"
import FinishProfile from "./Pages/userPages/FinishProfile"
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import AdminLoginPage from "./Pages/adminPages/AdminLoginPage"
import Dashboard from "./Pages/adminPages/DashBoard"
import UserManagementPage from "./Pages/adminPages/UserManagementPage"
import CountryManagementPage from "./Pages/adminPages/CountryManagementPage"
import LanguageManagementPage from "./Pages/adminPages/LanguageManagementPage"
import ReportsPage from "./Pages/adminPages/ReportsPage"
import ProfilePage from "./Pages/userPages/ProfilePage"
import EditProfilePage from "./Pages/userPages/EditProfilePage"
import ProfileView from "./Pages/adminPages/ProfileView"
import ChatsPage from "./Pages/userPages/ChatsPage"
import SessionsPage from "./Pages/userPages/SessionsPage"
import NotificationsPage from "./Pages/userPages/NotificationsPage"
import MessagesPage from "./Pages/adminPages/MessagesPage"

const router =createBrowserRouter([
  {
    path:'/',
    element:<LoginPage/>,
  },
  {
    path:'/signup',
    element:<SignupPage/>
  },
  {
    path:'/home',
    element:<HomePage/>
  },
  {
    path:'/finishprofilepage',
    element:<FinishProfile/>
  },
  {
    path:'/profilepage',
    element:<ProfilePage/>
  },
  {
    path:'/editprofilepage',
    element:<EditProfilePage/>
  },
  {
    path:'/chatspage',
    element:<ChatsPage/>
  },
  {
    path:'/sessionspage',
    element:<SessionsPage/>
  },
  {
    path:'/notificationspage',
    element:<NotificationsPage/>
  },
  {
    path:'/admin',
    element:<AdminLoginPage/>,
  },
  {
    path:'/adminhome',
    element:<Dashboard/>
  },
  {
    path:'/usermanagement',
    element:<UserManagementPage/>
 
  },
  {
    path:'/countrymanagement',
    element:<CountryManagementPage/>
  },
  {
    path:'/languagemanagement',
    element:<LanguageManagementPage/>
  },
  {
    path:'/reportmanagement',
    element:<ReportsPage/>
  },
  {
    path:'/profilemanagement',
    element:<ProfileView/>
  },
  {
    path:'/adminmessages',
    element:<MessagesPage/>
  }
 
])

function App() {
  return (
    <>
   <RouterProvider router={router} />
    </>
  )
}

export default App
