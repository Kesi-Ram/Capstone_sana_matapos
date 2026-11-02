import React from 'react'   
import { useState } from "react";
import Signin from './components/SigninPage/signin'
import MainDash from './components/dashboard/dashboardComponents/mainDash'
import './components/dashboard/dashboardComponents/dashboard.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <MainDash />
      ) : (
        <Signin onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}

export default App;