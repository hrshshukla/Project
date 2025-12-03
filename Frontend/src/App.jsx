import React from 'react'
import { Routes, Route } from 'react-router-dom'

import UserLogin from './Pages/UserLogin.jsx'
import UserLogout from './Pages/UserLogout.jsx'
import UserSignup from './Pages/UserSignup.jsx'
import CaptainLogin from './Pages/CaptainLogin.jsx'
import CaptainSignup from './Pages/CaptainSignup.jsx'
import Start from './Pages/Start.jsx'
import Home from './Pages/Home.jsx'
import UserProtectWrapper from './Pages/UserProtectWrapper.jsx'
import CaptainHome from './Pages/CaptainHome.jsx'
import CaptainProtectWrapper from './Pages/CaptainProtectWrapper.jsx'

const App = () => {
  return (
    <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/home' element={ <UserProtectWrapper>  <Home /> </UserProtectWrapper>} />
        <Route path='/users/logout' element={<UserProtectWrapper> <UserLogout /> </UserProtectWrapper>} />
        <Route path='/captain-signup' element={<CaptainSignup />} />
        <Route path='/captain-login' element={<CaptainLogin />} />
        <Route path='/captain-home' element={<CaptainProtectWrapper> <CaptainHome /> </CaptainProtectWrapper>} />
    </Routes>
  )
}

export default App