import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

const BASE_URL = "http://localhost:1515";

export const useMessageStore = create((set, get) => ({
  conversations: [],
  messages: [],
  loading: false,

  fetchConversations: async () => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ conversations: res.data.data || [] });
    } catch {
      set({ conversations: [] });
    } finally {
      set({ loading: false });
    }
  },

  fetchMessages: async (partnerId) => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    set({ loading: true });
    try {
      const res = await axios.get(
        `${BASE_URL}/api/messages/conversations/${partnerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ messages: res.data.data || [] });
    } catch {
      set({ messages: [] });
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (receiverId, text, productId) => {
    const { token } = useAuthStore.getState();
    if (!token) return null;
    try {
      const res = await axios.post(
        `${BASE_URL}/api/messages`,
        { receiverId, text, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newMsg = res.data.data;
      set((s) => ({ messages: [...s.messages, newMsg] }));
      return newMsg;
    } catch {
      return null;
    }
  },
}));
