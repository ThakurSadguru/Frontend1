import axios from "axios"
import type { LoginCredentials } from "../types/user";


// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//   });


export const userService = {

  async getUsers(){
    const token = sessionStorage.getItem('access_token')
      const res = await fetch("https://8e19-2401-4900-1c7e-ad2-5504-7bb7-3b95-bf19.ngrok-free.app/api/user/USER01",
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(res)
    },

 async login(credentials:LoginCredentials){
    const res = await axios.post("https://90ca-2401-4900-1c7e-ad2-5504-7bb7-3b95-bf19.ngrok-free.app/api/login",credentials)
    return res
}


    
}