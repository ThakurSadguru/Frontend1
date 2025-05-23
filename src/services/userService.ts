import axios from "axios";
import type { LoginCredentials, UpdateUserData } from "../types/user";
import { getAuthHeaders } from "../utils/AuthUtils";

const baseURL = import.meta.env.VITE_API_URL;

export const userService = {
  async login(credentials: LoginCredentials) {
    const res = await axios.post(`${baseURL}/login`, credentials);
    return res;
  },

  async getRoleOptions() {
    const res: any = await axios.get(`${baseURL}/roles`);
    return res.data;
  },
  
  async getUsers() {
    const token = sessionStorage.getItem("access_token");
    const res = await axios.get(`${baseURL}/users`, {
      headers:getAuthHeaders(token)
    });
    const data = await res.data;
    return data;
  },

  async updateUser(id: string, updatedata: UpdateUserData) {
    const token = sessionStorage.getItem("access_token");
    const response = await axios.put(`${baseURL}/user/${id}`, updatedata, {
      headers:getAuthHeaders(token)
    });

    const data = response.data;
    return data;
  },

  async deleteUser(id: string) {
    const token = sessionStorage.getItem("access_token");
    const response = await axios.delete(`${baseURL}/user/${id}`, {
      headers:getAuthHeaders(token)
    });

    const data = response.data;
    return data;
  },
};
