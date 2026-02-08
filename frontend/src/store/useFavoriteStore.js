import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const BASE_URL = "http://localhost:1515";

export const useFavoriteStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      loading: false,

      fetchFavorites: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return get().favorites;
        try {
          const res = await axios.get(`${BASE_URL}/api/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const items = res.data.data || [];
          set({ favorites: items });
          return items;
        } catch {
          return get().favorites;
        }
      },

      addToFavorites: async (product) => {
        const { token } = useAuthStore.getState();
        if (token) {
          set({ loading: true });
          try {
            await axios.post(
              `${BASE_URL}/api/favorites/${product.id}`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
            await get().fetchFavorites();
            set({ loading: false });
            toast.success("Added to favorites");
          } catch (err) {
            set({ loading: false });
            toast.error(
              err.response?.data?.message || "Failed to add to favorites"
            );
          }
        } else {
          const exists = get().isInFavorites(product.id);
          if (!exists) {
            set((state) => ({
              favorites: [...state.favorites, { productId: product.id, Product: product }],
            }));
            toast.success("Added to favorites");
          }
        }
      },

      removeFromFavorites: async (productId) => {
        const { token } = useAuthStore.getState();
        if (token) {
          try {
            await axios.delete(`${BASE_URL}/api/favorites/${productId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            await get().fetchFavorites();
            toast.success("Removed from favorites");
          } catch {
            toast.error("Failed to remove");
          }
        } else {
          set((state) => ({
            favorites: state.favorites.filter(
              (f) => (f.Product?.id ?? f.productId) !== productId
            ),
          }));
          toast.success("Removed from favorites");
        }
      },

      isInFavorites: (productId) => {
        return get().favorites.some(
          (f) => (f.Product?.id ?? f.productId) === productId
        );
      },

      toggleFavorite: async (product) => {
        if (get().isInFavorites(product.id)) {
          await get().removeFromFavorites(product.id);
        } else {
          await get().addToFavorites(product);
        }
      },
    }),
    {
      name: "favorites-storage",
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);
