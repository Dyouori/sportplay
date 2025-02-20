import axios from 'axios'

const request = axios.create({
  baseURL: '',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

request.interceptors.request.use(

)

request.interceptors.response.use(response => {
  if (response.data) {
    return response.data
  }
  return response
}, (error) => {
  // Do something with response error
  return Promise.reject(error)
})

export default request
