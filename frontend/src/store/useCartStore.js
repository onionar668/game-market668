import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const BASE_URL = "http://localhost:1515";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      loading: false,

      addToCart: async (product, quantity = 1) => {
        const { token } = useAuthStore.getState();
        if (token) {
          set({ loading: true });
          try {
            await axios.post(
              `${BASE_URL}/api/cart`,
              { productId: product.id, quantity },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            await get().fetchCart();
            toast.success("Added to cart");
          } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add to cart");
          } finally {
            set({ loading: false });
          }
        } else {
          set((state) => {
            const existing = state.cartItems.find((i) => i.product?.id === product.id || i.productId === product.id);
            let newItems;
            if (existing) {
              newItems = state.cartItems.map((i) =>
                i.product?.id === product.id || i.productId === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              );
            } else {
              newItems = [...state.cartItems, { product, productId: product.id, quantity }];
            }
            return { cartItems: newItems };
          });
          toast.success("Added to cart");
        }
      },

      fetchCart: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return get().cartItems;
        try {
          const res = await axios.get(`${BASE_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const items = res.data.data || [];
          set({ cartItems: items });
          return items;
        } catch {
          return get().cartItems;
        }
      },

      removeFromCart: async (cartItemIdOrProductId) => {
        const { token } = useAuthStore.getState();
        if (token) {
          try {
            await axios.delete(`${BASE_URL}/api/cart/${cartItemIdOrProductId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            await get().fetchCart();
            toast.success("Removed from cart");
          } catch {
            toast.error("Failed to remove");
          }
        } else {
          set((state) => ({
            cartItems: state.cartItems.filter(
              (i) => i.id !== cartItemIdOrProductId && i.productId !== cartItemIdOrProductId
            ),
          }));
          toast.success("Removed from cart");
        }
      },

      updateQuantity: async (cartItemId, quantity) => {
        const { token } = useAuthStore.getState();
        if (token) {
          try {
            await axios.put(
              `${BASE_URL}/api/cart/${cartItemId}`,
              { quantity },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            await get().fetchCart();
          } catch {
            toast.error("Failed to update");
          }
        } else {
          if (quantity <= 0) {
            set((state) => ({
              cartItems: state.cartItems.filter(
                (i) => i.id !== cartItemId && i.productId !== cartItemId
              ),
            }));
            return;
          }
          set((state) => ({
            cartItems: state.cartItems.map((i) =>
              (i.id === cartItemId || i.productId === cartItemId)
                ? { ...i, quantity }
                : i
            ),
          }));
        }
      },

      getCartCount: () => {
        const items = get().cartItems;
        return items.reduce((sum, i) => sum + (i.quantity || 1), 0);
      },

      getTotalPrice: () => {
        const items = get().cartItems;
        return items.reduce((sum, i) => {
          const p = i.Product || i.product;
          const price = p ? Number(p.price) : 0;
          return sum + price * (i.quantity || 1);
        }, 0);
      },
    }),
    { name: "cart-storage", partialize: (state) => ({ cartItems: state.cartItems }) }
  )
);
