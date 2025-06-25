import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'

function Success() {
  const [searchParams]=  useSearchParams()
  const navigate = useNavigate()

  useEffect(() => { 
    const token = searchParams.get("token")
    console.log('token',token)
    if (token){
        console.log('going to home page')
        navigate("/home")
        localStorage.setItem("token",token)
        localStorage.setItem("islogged",true)
    }else{
        console.log('going to login page')
        navigate("/login")
    }

}, [searchParams])

  return (
    <div>Success</div>
  )
}

export default Success