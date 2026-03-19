import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.100:8000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = await AsyncStorage.getItem("refresh_token");
        const res = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
        const newAccess = res.data.access;
        await AsyncStorage.setItem("access_token", newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch {
        await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
