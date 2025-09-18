import axios from "axios";

// Use Vite environment variable
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
  baseURL: VITE_API_BASE_URL,
  withCredentials: true, // send cookies
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
