import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Divider, List, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [data,setData] = useState()
  const [loading,setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(()=>{
    const token =  localStorage.getItem('token')
    const AuthStr = 'Bearer '.concat(token);
    console.log('auth',AuthStr)
    axios.get('http://localhost:3000/api/v1/alltickets', {
      headers: { Authorization: AuthStr },
    })
    .then((response) => {
      console.log("Response:", response);  // Logs the whole response
      if (response.status === 200 && response.data.resp_object) {
        setData(response.data.resp_object.tickets);
        setLoading(false)
      } else {
        console.log('No data returned', response.status);
      }
    })
    .catch((error) => {
      navigate('/')
      console.log('Error:', error);
    });
  },[])

  const handleLogOut = ()=>{
    navigator('/login');
    localStorage.removeItem("islogged");
    localStorage.removeItem("token")
  }

  return (
    <>
      <div>HomePage</div>
      {loading === true ? <h1>loading..</h1> : <List
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Typography.Text> {item.id}</Typography.Text>
        </List.Item>
      )}
    /> }
      <button onClick={handleLogOut}>LoggOut</button>
    </>
  )
}

export default HomePage