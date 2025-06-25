import axios from 'axios';
import { json } from 'react-router-dom';

// const BASE_URL = ''

export async function forgetpassword(payload) {
  try {
    const data = JSON.stringify(payload)
    const config = {
      method: 'post',
      // maxBodyLength: Infinity,
      url: 'http://localhost:3000/admin/forgetpassword',
      headers: {
        'Content-type': 'application/json'
      },
      data
    }
    const response = await axios.request(config)
    return response.data
  } catch (err) {
    console.log(err)
  }
}

export async function getAllTickets(auth) {
  try {
    const config = {
      method: 'get',
      url: '',
      headers: {
        Authorization: auth
      }
    }
    const response = await axios.request(config)
    return response.data
  } catch (err) {
    console.log(err)
  }
}

export async function purchaseTicket(payload) {
  try {

    const data = JSON.stringify(payload)
    const config = {
      method: 'post',
      url: 'http://localhost:3000/api/v1/order',
      headers: {
        'Content-type': 'application/json'
      },
      data
    }
    const response = await axios.request(config)
    return response.data
  } catch (err) {
    console.log(err)
  }
}

export async function validatePurchase(payload) {
  try {
    const data = JSON.stringify(payload)
    const config = {
      method: 'post',
      url: 'http://localhost:3000/api/v1/order/validate',
      headers: {
        'Content-type': 'application/json'
      },
      data
    }
    const response = await axios.request(config)
    return response.data
  } catch (e) {
    console.log(e)
  }
}