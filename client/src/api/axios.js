import axios from 'axios';

// Backend Express API ka base URL - Vite env variable se aata hai
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // zaroori hai taake httpOnly cookie (JWT) bhej/receive ho sake
});

export default api;