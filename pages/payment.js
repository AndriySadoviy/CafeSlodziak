import { useState } from "react";
import { useRouter } from "next/router";
import useCartStore from "../lib/store/cartStore";
import useAuthStore from "../lib/store/authStore";
import { useTranslation } from "../lib/store/languageStore";

const paymentMethods = [
  { id: "blik", label: "BLIK", icon: "💳" },
  { id: "apple_pay", label: "Apple Pay", icon: "🍎" },
  { id: "google_pay", label: "Google Pay", icon: "🤖" },
  { id: "card", label: "Karta płatnicza", icon: "💳" },
];

export default function Payment() {
  const { t } = useTranslation();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const pickupTime = useCartStore((s) => s.pickupTime);
  const comment = useCartStore((s) => s.comment);
  const customerName = useCartStore((s) => s.customerName);
  const customerPhone = useCartStore((s) => s.customerPhone);
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useAuthStore((s) => s.user);
  const [selectedMethod, setSelectedMethod] = useState("blik");
  const [paying, setPaying] = useState(false);

  // Оплата онлайн вимкнена: лише фіксуємо замовлення (без реальної оплати)
  const handleConfirmOrder = async () => {
    setPaying(true);
    try {
      const orderItems = items.map((item) => ({
        nameKey: item.nameKey,
        quantity: item.quantity,
        price: item.price,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          items: orderItems,
          total,
          pickupTime,
          comment,
          customerName,
          customerPhone,
          paymentMethod: selectedMethod,
          paymentSuccess: false,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Nie udało się zapisać zamówienia");

      if (data.email && data.email.sent === false) {
        console.warn("Powiadomienie nie wysłane:", data.email);
      }

      clearCart();
      router.push("/order");
    } catch (err) {
      console.error(err);
      alert(err.message || "Wystąpił błąd. Spróbuj ponownie.");
      setPaying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500">Koszyk jest pusty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-4 py-5 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark-chocolate mb-4 sm:mb-6">
        {t("checkout")}
      </h1>

      <div className="bg-brand-orange-light/50 text-brand-dark-chocolate text-sm p-3 rounded-xl mb-6">
        {t("payOnPickupNote")}
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-brand-dark-chocolate mb-2">
          Twoje zamówienie
        </h2>
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li
              key={item.id}
              className="py-2 flex flex-col sm:flex-row justify-between gap-1 text-gray-700"
            >
              <span className="break-words pr-2">
                {t(item.nameKey)} × {item.quantity}
              </span>
              <span className="font-semibold shrink-0">
                {item.price * item.quantity} zł
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between font-bold text-lg">
          <span>Suma</span>
          <span className="text-brand-orange-zest">{total} zł</span>
        </div>
        {comment && (
          <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
            <span className="font-semibold">Uwagi:</span> {comment}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-brand-dark-chocolate mb-2">
          Preferowana metoda płatności
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Wybór tylko informacyjny — płatność online jest wyłączona.
        </p>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center p-3 border rounded-xl cursor-pointer transition ${
                selectedMethod === method.id
                  ? "border-brand-orange-zest bg-brand-orange-light/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => setSelectedMethod(method.id)}
                className="mr-3 accent-brand-orange-zest"
              />
              <span className="text-2xl mr-3">{method.icon}</span>
              <span className="font-medium">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleConfirmOrder}
        disabled={paying}
        className="w-full bg-brand-orange-zest hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-xl transition-colors disabled:opacity-50 flex justify-center items-center"
      >
        {paying ? "..." : t("placeOrder")}
      </button>
    </div>
  );
}