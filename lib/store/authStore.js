import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      orders: [],
      login: async (email, password) => {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || "Invalid credentials");
        }
        set({ user: data });
        try {
          const ordersRes = await fetch(`/api/orders?userId=${data.id}`);
          const orders = ordersRes.ok ? await ordersRes.json() : [];
          set({ orders: Array.isArray(orders) ? orders : [] });
        } catch {
          set({ orders: [] });
        }
      },
      register: async (name, email, password) => {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || "Registration failed");
        }
        set({ user: data, orders: [] });
      },
      logout: () => set({ user: null, orders: [] }),
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;