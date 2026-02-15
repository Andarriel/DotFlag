import axios from 'axios';

//const API_BASE_URL = 'http://localhost:3001/api';

export const authApi = axios.create({
  baseURL: '/api',
  withCredentials: true, // This is crucial for sending session cookies!
});