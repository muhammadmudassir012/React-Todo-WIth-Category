import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from '../Pages/HomePage'
import TestingPage from '../Pages/TestingPage'
import LoginPage from '../Pages/LoginPage'
import SignupPage from '../Pages/SignupPage'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../Config/FirebaseConfig'
import CategoryPage from '../Pages/CategoryPage'

function Routing() {
    const [authentication, setAuthentication] = useState(true)
  useEffect(()=> {
    check()
  },[authentication])
  const check = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid);
        console.log("user signed in");
        setAuthentication(true)
      } else {
        console.log("user signed out");
        setAuthentication(false) 
      }
    });
  }
  return (
    <div>
      <BrowserRouter>
         <Routes>
            <Route path='/' element={authentication ? <HomePage/> : <Navigate to={'/login'}/>}  />
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/signup' element={<SignupPage/>} />
            <Route path='/category/:name' element={authentication ? <CategoryPage/> : <Navigate to={'/login'}/>} />
         </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Routing
