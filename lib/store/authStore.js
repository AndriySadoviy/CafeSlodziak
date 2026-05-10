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
        if (!res.ok) throw new Error("Invalid credentials");
        const user = await res.json();
        set({ user });
        const ordersRes = await fetch(`/api/orders?userId=${user.email}`);
        const orders = await ordersRes.json();
        set({ orders });
      },
      register: async (name, email, password) => {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) throw new Error("Registration failed");
        const user = await res.json();
        set({ user, orders: [] });
      },
      logout: () => set({ user: null, orders: [] }),
      addOrder: (newOrder) =>
        set((state) => ({ orders: [...state.orders, newOrder] })),
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;