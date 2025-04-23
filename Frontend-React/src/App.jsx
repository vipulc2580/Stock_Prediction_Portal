import { use, useContext, useState } from 'react'
import './assets/css/style.css'
import Main from './components/main'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './components/Login'
import Register from './components/register'
import RegisterSuccess from './components/RegisterSuccess'
import { AuthContext } from './components/AuthProvider'
import AuthProvider from './components/AuthProvider'
import ActivateAccount from './components/ActivateAccount'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'
import IsRegisterSuccess from './IsRegisterSuccess'
import IsActivateSuccess from './IsActivateSuccess'
function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/register/' element={<PublicRoutes><Register /></PublicRoutes>} />
            <Route path='/login/' element={<PublicRoutes><Login /></PublicRoutes>} />
            <Route path='/register/success/' element={<IsRegisterSuccess><RegisterSuccess /></IsRegisterSuccess>} />
            <Route path="/activate/:uid/:token" element={<IsActivateSuccess><ActivateAccount /></IsActivateSuccess>} />
            <Route path="/forgot_password/" element={<PublicRoutes><ForgotPassword /></PublicRoutes>} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
            <Route path="/dashboard/" element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
