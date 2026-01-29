import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
console.log(BASE_URL)

const API = axios.create({ baseURL: BASE_URL });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;