import axios from "axios";
import type { LoginCredentials, UpdateUserData } from "../types/user";

const baseURL = import.meta.env.VITE_API_URL;

export const userService = {
  async login(credentials: LoginCredentials) {
    const res = await axios.post(`${baseURL}/login`, credentials);
    return res;
  },
  async getRoleOptions() {
    const res: any = await axios.get(`${baseURL}/roles`);
    return res.data.data;
  },
  async getUsers() {
    const token = sessionStorage.getItem("access_token");
    const res = await axios.get(`${baseURL}/users`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.data;
    console.log(data);
    return data;
  },

  async updateUser(id: string, updatedata: UpdateUserData) {
    const token = sessionStorage.getItem("access_token");

    // Log the request for debugging
    console.log(`Updating user: ${baseURL}/user/${id}`, updatedata);

    const response = await axios.put(`${baseURL}/user/${id}`, updatedata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    console.log("Update response:", data);
    return data;
  },

  async deleteUser(id: string) {
    const token = sessionStorage.getItem("access_token");

    // Log the request for debugging
    console.log(`Deleting user: ${baseURL}/user/${id}`);

    const response = await axios.delete(`${baseURL}/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    console.log("Delete response:", data);
    return data;
  },
};
