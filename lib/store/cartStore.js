import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      pickupTime: "12:00",
      comment: "",
      customerName: "",
      customerPhone: "",
      addItem: (product) => {
        const existing = get().items.find((item) => item.id === product.id);
        if (existing) {
          set({
            items: get().items.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ items: [...get().items, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((item) => item.id !== productId) }),
      increaseQuantity: (productId) =>
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }),
      decreaseQuantity: (productId) => {
        const existing = get().items.find((item) => item.id === productId);
        if (existing.quantity === 1) {
          get().removeItem(productId);
        } else {
          set({
            items: get().items.map((item) =>
              item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
            ),
          });
        }
      },
      clearCart: () =>
        set({ items: [], comment: "", customerName: "", customerPhone: "" }),
      setPickupTime: (time) => set({ pickupTime: time }),
      setComment: (comment) => set({ comment }),
      setCustomerName: (customerName) => set({ customerName }),
      setCustomerPhone: (customerPhone) => set({ customerPhone }),
      total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);

export default useCartStore;