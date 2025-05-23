import axios from "axios";
import type { invitationType } from "../types/invitation";
import { getAuthHeaders } from "../utils/AuthUtils";

const baseUrl = import.meta.env.VITE_API_URL;

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export const invitationService = {
  /**
   * Sends a new invitation
   */
  async sendInvitation(invitation: invitationType): Promise<APIResponse> {
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await axios.post<APIResponse>(
        `${baseUrl}/api/sendinvitation`,
        invitation,
        { headers: getAuthHeaders(token) }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending invitation:", error);
      return { success: false, message: "Failed to send invitation" };
    }
  },

  /**
   * Re-sends an invitation to a specific email
   */
  async reSendInvitation(email: string): Promise<APIResponse> {
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await axios.post<APIResponse>(
        `${baseUrl}/api/resendinvitation`,
        { email }, // Pass as object
        { headers: getAuthHeaders(token) }
      );
      return response.data;
    } catch (error) {
      console.error("Error resending invitation:", error);
      return { success: false, message: "Failed to resend invitation" };
    }
  },

  /**
   * Deletes an invitation for a specific email
   */
  async deleteInvitation(email: string): Promise<APIResponse> {
    try {
      const token = sessionStorage.getItem("access_token");
      const response= await axios.post<APIResponse>(
        `${baseUrl}/api/deleteinvitation`,
        { email }, // Pass as object
        { headers: getAuthHeaders(token) }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting invitation:", error);
      return { success: false, message: "Failed to delete invitation" };
    }
  },

  async getRoles(){
    try {
      const res:any = await axios.get(`${baseUrl}/api/roles`);
      if(res.data.success){
        return res.data.data;
      }
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * Fetches all invitations
   */
  async fetchInvitation(): Promise<APIResponse<invitationType[]>> {
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await axios.get<APIResponse>(
        `${baseUrl}/api/invitations`,
        { headers: getAuthHeaders(token) }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching invitations:", error);
      return { success: false, message: "Failed to fetch invitations" };
    }
  }
};
