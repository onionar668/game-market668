import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const BASE_URL = "http://localhost:1515";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post(`${BASE_URL}/api/auth/login`, {
            email,
            password,
          });
          const { id, email: userEmail, token } = res.data.data;
          set({ user: { id, email: userEmail }, token, error: null });
          return { success: true };
        } catch (err) {
          const message =
            err.response?.data?.message || "Login failed";
          set({ error: message });
          return { success: false, error: message };
        } finally {
          set({ loading: false });
        }
      },

      register: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post(`${BASE_URL}/api/auth/register`, {
            email,
            password,
          });
          const { id, email: userEmail, token } = res.data.data;
          set({ user: { id, email: userEmail }, token, error: null });
          return { success: true };
        } catch (err) {
          const message =
            err.response?.data?.message || "Registration failed";
          set({ error: message });
          return { success: false, error: message };
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      isAuthenticated: () => !!get().token,

      getAuthHeader: () => {
        const { token } = get();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
    { name: "auth-storage" }
  )
);
