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
      headers: getAuthHeaders(token),
    });
    const data = await res.data;
    return data;
  },

  async updateUser(id: string, updatedata: UpdateUserData) {
    const token = sessionStorage.getItem("access_token");
    const response = await axios.put(`${baseURL}/user/${id}`, updatedata, {
      headers: getAuthHeaders(token),
    });

    const data = response.data;
    return data;
  },

  async updateUserStatus(id: string, isActive: boolean) {
    const token = sessionStorage.getItem("access_token");
    const payload = { status: isActive };

    const response = await axios.put(
      `${baseURL}/user/updatestatus/${id}`,
      payload,
      {
        headers: getAuthHeaders(token),
      }
    );

    return response.data;
  },
};
