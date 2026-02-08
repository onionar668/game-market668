import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const BASE_URL = "http://localhost:1515";

export const useProductStore = create((set, get) => ({
  products: [],
  pagination: { page: 1, limit: 12, total: 0, totalPages: 1 },
  filters: { search: "", category: "", priceMin: "", priceMax: "" },
  loading: false,
  error: null,

  formData: {
    name: "",
    price: "",
    img: "",
    category: "",
  },
  setFormData: (formData) => set({ formData }),
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  resetForm: () =>
    set({ formData: { name: "", price: "", img: "", category: "" } }),

  addProduct: async (event) => {
    event.preventDefault();
    const { token } = useAuthStore.getState();
    if (!token) {
      toast.error("Please sign in to add products");
      return;
    }
    set({ loading: true });
    try {
      const { formData } = get();
      await axios.post(
        `${BASE_URL}/api/product`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added");
      document.getElementById("add_product_modal").close();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add product");
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async (page = 1) => {
    set({ loading: true });
    try {
      const { filters } = get();
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.priceMin && { priceMin: filters.priceMin }),
        ...(filters.priceMax && { priceMax: filters.priceMax }),
      });
      const response = await axios.get(`${BASE_URL}/api/product?${params}`);
      set({
        products: response.data.data,
        pagination: response.data.pagination,
        error: null,
      });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const product = await axios.get(`${BASE_URL}/api/product/${id}`);
      set({
        product: product.data.data,
        formData: product.data.data,
        error: null,
      });
    } catch (e) {
      set({ error: e.message });
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      toast.error("Please sign in");
      return;
    }
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((prev) => ({ products: prev.products.filter((el) => el.id !== id) }));
      toast.success("Product deleted");
    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      toast.error("Please sign in");
      return;
    }
    set({ loading: true });
    try {
      const { formData } = get();
      const update = await axios.put(`${BASE_URL}/api/product/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ product: update.data.data });
      toast.success("Product updated");
    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchUserProducts: async (userId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/api/users/${userId}`);
      return res.data.data;
    } catch (err) {
      toast.error("Failed to load profile");
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));
