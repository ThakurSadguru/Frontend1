import axios from "axios"
import type { InvitationRedeem, LoginCredentials } from "../types/user";
import { getAuthHeaders } from "../utils/AuthUtils";


const baseUrl = import.meta.env.VITE_API_URL;

export const userService = {

 async login(credentials:LoginCredentials){
    const res:any = await axios.post(`${baseUrl}/api/login`,credentials)
    return res.data.data;
},
async logout(){
  const token = sessionStorage.getItem('access_token');
  const res:any = await axios.post(`${baseUrl}/api/logout`,{},{
    headers: getAuthHeaders(token)
  })
  console.log(token);
  console.log(res.data)
  if(res.data.success){
    return res.data;
  }
  
},
async redeemInvitation(credentials: InvitationRedeem) {
  const token = sessionStorage.getItem('access_token'); // or however you store it
  const res: any = await axios.post(
    `${baseUrl}/api/InvitationRedeem`,
    credentials,
    {
      headers: getAuthHeaders(token),
    }
  );

  if (res.data.success) {
    return res.data;
  }
}


    
}