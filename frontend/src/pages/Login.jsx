import React from 'react'
import {useNavigate} from 'react-router-dom'
import { useEffect } from 'react'

function Login() {
  const navigate = useNavigate()
  let LoggedIn

  useEffect(() => {
    const isLogged = localStorage.getItem('islogged');
    LoggedIn = isLogged;
    console.log('LoggedIn',LoggedIn)
    if(LoggedIn){
      navigate('/home')
    }
    // else{
    //   navigate('/')
    // }
  }, []);

  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={loginWithGoogle}>Login with Google</button>
      <button onClick={()=>navigate('/forgetpassword')}>Forget Password</button>
    </div>
  );
}


export default Login