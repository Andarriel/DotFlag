import axios from 'axios';

// The base URL for your backend server
const API_BASE_URL = 'http://localhost:3001/api';

export const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for sending session cookies!
});