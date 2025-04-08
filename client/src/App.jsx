import { Children, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { FloatingShape } from './components/FloatingShape'
import SignUp from './Pages/SignUp'
import Login from './Pages/Login'
import {Navigate, Route, Routes } from "react-router-dom"
import EmailVerificationPage from './Pages/EmailVerificationPage'
import {Toaster} from "react-hot-toast"
import { useAuthStore } from './store/authStore'
import DashboardPage from './Pages/DashboardPage'
import LoadingSpinner from './components/LoadingSpinner'
import ForgetPassword from './Pages/ForgetPassword'
import ResetPasswordPage from './Pages/ResetPasswordPage'



const ProtectedRoute=({children})=>{
  const {isAuthenticated,user}=useAuthStore();
  
  if(!isAuthenticated){
    return <Navigate to="/login" replace/>;
  }
  if(!user.isVerified){
    return <Navigate to="/verify-email" replace/>;
  }
  return children;

}

const RedirectAuthenticatedUser=({children})=>{
  const {isAuthenticated,user}=useAuthStore();

  if(isAuthenticated && user.isVerified){
    return <Navigate to="/" replace/>
  }
  return children;
}

function App() {
  const {isCheckingAuth ,checkAuth }=useAuthStore();
  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(isCheckingAuth){
    return <LoadingSpinner/>;
  }
  return(
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
     <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" Left="10%" delay={0}/>
     <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" Left="80%" delay={5}/>
     <FloatingShape color="bg-lime-500" size="w-64 h-64" top="40%" Left="-10%" delay={2}/>

    <Routes>
      <Route path="/" element={<ProtectedRoute><DashboardPage/></ProtectedRoute>} />
      <Route path="/SignUp" element={<RedirectAuthenticatedUser><SignUp/></RedirectAuthenticatedUser>}/>
      <Route path="/Login" element={<RedirectAuthenticatedUser><Login/></RedirectAuthenticatedUser>}/>
      <Route path="/verify-email"element={<EmailVerificationPage/>}/>
      <Route path="/forget-password" element={<RedirectAuthenticatedUser><ForgetPassword/></RedirectAuthenticatedUser>}/>
      <Route path='/reset-password/:token' element={<RedirectAuthenticatedUser><ResetPasswordPage/></RedirectAuthenticatedUser>}></Route>
    </Routes>
    <Toaster/>


    </div>


  )
}
export default App
