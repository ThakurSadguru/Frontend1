import axios from 'axios';
import type { Client } from '../types/client';
import { getAuthHeaders } from '../utils/AuthUtils';

// Make sure API_URL either comes from env variable or defaults to the correct URL with /api prefix
const API_URL = import.meta.env.VITE_API_URL|| 'http://localhost:3000/api';

// Update to use sessionStorage and correct token key
const getToken = () => sessionStorage.getItem('access_token');

export async function createClient(clientData: Omit<Client, '_id'>) {
  try {
    const response = await axios.post<Client>(`${API_URL}/client`, clientData, {
      headers: getAuthHeaders(getToken())
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error creating client:', error);
    return { data: null, error };
  }
}

export async function getClients() {
  try {
    const response = await axios.get<Client[]>(`${API_URL}/clients`, {
      headers: getAuthHeaders(getToken())
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error fetching clients:', error);
    return { data: null, error };
  }
}

export async function getClientById(id: string) {
  try {
    const response = await axios.get<Client>(`${API_URL}/client/${id}`, {
      headers: getAuthHeaders(getToken())
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`Error fetching client with ID ${id}:`, error);
    return { data: null, error };
  }
}

export async function updateClient(id: string, clientData: Partial<Client>) {
  try {
    const response = await axios.patch<Client>(`${API_URL}/client/${id}`, clientData, {
      headers: getAuthHeaders(getToken())
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`Error updating client with ID ${id}:`, error);
    return { data: null, error };
  }
}

export const deleteClient = async (clientId: string) => {
  return await axios.delete(`${API_URL}/client/${clientId}`, {
    headers: getAuthHeaders(getToken())
  });
};
