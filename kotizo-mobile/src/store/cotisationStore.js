import { create } from 'zustand';
import api from '../services/api';

const useCotisationStore = create((set, get) => ({
  cotisations: [],
  mesCotisations: { creees: [], participees: [] },
  cotisationActuelle: null,
  isLoading: false,
  error: null,

  chargerCotisations: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/cotisations/');
      set({ cotisations: res.data, isLoading: false });
    } catch {
      set({ error: 'Erreur de chargement', isLoading: false });
    }
  },

  chargerMesCotisations: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/cotisations/mes-cotisations/');
      set({ mesCotisations: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  chargerCotisation: async (slug) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/cotisations/${slug}/`);
      set({ cotisationActuelle: res.data, isLoading: false });
      return res.data;
    } catch {
      set({ isLoading: false });
      return null;
    }
  },

  creerCotisation: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/cotisations/', data);
      set({ isLoading: false });
      return { succes: true, cotisation: res.data };
    } catch (err) {
      const code = err.response?.data?.code;
      set({ isLoading: false });
      return { succes: false, erreur: err.response?.data, code };
    }
  },

  rejoindre: async (slug) => {
    try {
      const res = await api.post(`/cotisations/${slug}/rejoindre/`);
      return { succes: true, participation: res.data };
    } catch (err) {
      return { succes: false, erreur: err.response?.data?.error };
    }
  },

  reinitialiser: () => set({ error: null, cotisationActuelle: null }),
}));

export default useCotisationStore;