import axios from "axios";
import type { LoginCredentials } from "../types/user";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const userService = {

  async getUsers() {
    const token = sessionStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/user/USER01`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(res);
    return res;
  },

  async login(credentials: LoginCredentials) {
    const res = await axios.post(`${API_BASE_URL}/login`, credentials);
    return res;
  }
};
