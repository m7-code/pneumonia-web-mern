import axios from 'axios';

// Backend Express API ka base URL - baad me .env se dynamic kar denge
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // zaroori hai taake httpOnly cookie (JWT) bhej/receive ho sake
});

export default api;