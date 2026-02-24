import axios from "axios";

const API_URL = "http://localhost:8080";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers["Authorization"] = "Bearer " + user.token;
        }
      }
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
