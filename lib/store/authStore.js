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
        const userData = await res.json();
        set({ user: userData });   // ← зберігаємо ВСЕ (включаючи role)
        const ordersRes = await fetch(`/api/orders?userId=${userData.id}`);
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
        const userData = await res.json();
        set({ user: userData, orders: [] }); // ← зберігаємо role
      },
      logout: () => set({ user: null, orders: [] }),
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;