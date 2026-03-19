import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  connexion: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/connexion/", { email, password });
      const { access, refresh, user } = res.data;
      await AsyncStorage.setItem("access_token", access);
      await AsyncStorage.setItem("refresh_token", refresh);
      set({ user, isAuthenticated: true, isLoading: false });
      return { succes: true };
    } catch (err) {
      const message = err.response?.data?.error || "Erreur de connexion";
      const code = err.response?.data?.code || "";
      set({ error: message, isLoading: false });
      return { succes: false, message, code };
    }
  },

  deconnexion: async () => {
    try {
      const refresh = await AsyncStorage.getItem("refresh_token");
      await api.post("/auth/deconnexion/", { refresh });
    } catch {}
    await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
    set({ user: null, isAuthenticated: false });
  },

  chargerProfil: async () => {
    try {
      const res = await api.get("/auth/profil/");
      set({ user: res.data, isAuthenticated: true });
    } catch {
      set({ isAuthenticated: false });
    }
  },

  reinitialiserErreur: () => set({ error: null }),
}));

export default useAuthStore;
