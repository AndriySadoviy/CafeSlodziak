import useCartStore from "../lib/store/cartStore";
import CartItem from "../components/CartItem";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "../lib/store/languageStore";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const pickupTime = useCartStore((s) => s.pickupTime);
  const setPickupTime = useCartStore((s) => s.setPickupTime);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();
  const [ordering, setOrdering] = useState(false);
  const { t } = useTranslation();

  const handleCheckout = () => {
    setOrdering(true);
    setTimeout(() => {
      const order = {
        id: Date.now(),
        items: items.map((i) => ({
          productId: i.id,
          nameKey: i.nameKey,
          quantity: i.quantity,
          price: i.price,
        })),
        total,
        pickupTime,
        date: new Date().toISOString().split("T")[0],
        status: "completed",
      };
      const existing = JSON.parse(localStorage.getItem("guestOrders") || "[]");
      existing.push(order);
      localStorage.setItem("guestOrders", JSON.stringify(existing));
      clearCart();
      router.push("/order");
    }, 1500);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-brand-dark-chocolate mb-4">{t("cart")}</h1>
      {items.length === 0 ? (
        <p className="text-xl text-gray-500 mt-8">{t("noOrders")}</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-8 bg-white p-6 rounded-3xl shadow-lg border border-brand-caramel-mousse/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-brand-dark-chocolate">{t("total")}:</span>
              <span className="text-3xl font-extrabold text-brand-orange-zest">{total} zł</span>
            </div>
            <div className="mb-6">
              <label className="block text-lg font-semibold text-brand-dark-chocolate mb-2">
                {t("pickupTime")}:
              </label>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full md:w-48 border-brand-caramel-mousse rounded-xl p-2"
              >
                {["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map(
                  (time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  )
                )}
              </select>
            </div>
            <button
              onClick={handleCheckout}
              disabled={ordering}
              className="w-full bg-brand-orange-zest hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-xl transition-colors disabled:opacity-50"
            >
              {ordering ? "..." : t("checkout")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}