import { create } from "zustand";
import api from "../services/api";

const useCotisationStore = create((set) => ({
  cotisations: [],
  mesCotisations: { creees: [], participees: [] },
  isLoading: false,
  error: null,

  chargerCotisations: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/cotisations/");
      set({ cotisations: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  chargerMesCotisations: async () => {
    try {
      const res = await api.get("/cotisations/mes-cotisations/");
      set({ mesCotisations: res.data });
    } catch {}
  },

  creerCotisation: async (data) => {
    try {
      const res = await api.post("/cotisations/", data);
      return { succes: true, data: res.data };
    } catch (err) {
      return { succes: false, message: err.response?.data?.error || "Erreur" };
    }
  },

  rejoindre: async (slug) => {
    try {
      const res = await api.post(`/cotisations/${slug}/rejoindre/`);
      return { succes: true, data: res.data };
    } catch (err) {
      return { succes: false, message: err.response?.data?.error || "Erreur" };
    }
  },
}));

export default useCotisationStore;
