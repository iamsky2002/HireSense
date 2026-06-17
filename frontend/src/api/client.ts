import axios from "axios";

// in production set REACT_APP_API_URL to the deployed backend (e.g. https://api.example.com/api)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
});

// har request ke saath JWT token bhej do (agar logged in ho)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
