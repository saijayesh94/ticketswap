import React from 'react'
import { forgetpassword } from '../api/api'

function ForgetPassword() {

  const handlesubmit =async  (event)=>{
    event.preventDefault();
    const email = event.target.email.value; // Get the email value
    const Payload = {
      email
    }
    const response = await forgetpassword(Payload);
    if(response.status === 'success'){
      alert('password reset email has beeen sent to your mail')
    }
  }
  return (
    <>
      <div>ForgetPassword</div>
      <form onSubmit={handlesubmit}>
        <label htmlFor='email'>email</label>
        <input type='email' name='email' placeholder='enter your email' id='email' required/>
        <button type="submit" >Reset Password</button>
      </form>
    </>

  )
}

export default ForgetPassword