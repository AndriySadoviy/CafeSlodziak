import useCartStore from "../lib/store/cartStore";
import CartItem from "../components/CartItem";
import { useRouter } from "next/router";
import { useTranslation } from "../lib/store/languageStore";
import useAuthStore from "../lib/store/authStore";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const pickupTime = useCartStore((s) => s.pickupTime);
  const setPickupTime = useCartStore((s) => s.setPickupTime);
  const comment = useCartStore((s) => s.comment);
  const setComment = useCartStore((s) => s.setComment);
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const goToPayment = () => {
    // Просто переходимо на сторінку оплати
    router.push("/payment");
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-4xl font-bold text-brand-dark-chocolate mb-4">
        {t("cart")}
      </h1>

      {items.length === 0 ? (
        <p className="text-xl text-gray-500 mt-8">{t("noOrders")}</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-8 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-brand-caramel-mousse/20">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <span className="text-xl sm:text-2xl font-bold text-brand-dark-chocolate">
                {t("total")}:
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-orange-zest">
                {total} zł
              </span>
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
                {["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"].map(
                  (time) => (
                    <option key={time} value={time}>{time}</option>
                  )
                )}
              </select>
            </div>

            {/* Поле коментаря */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-brand-dark-chocolate mb-2">
                Uwagi do zamówienia
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full border-brand-caramel-mousse rounded-xl p-3"
                placeholder="Np. uczulenie na orzechy, poproszę więcej sosu..."
              />
            </div>

            <button
              onClick={goToPayment}
              disabled={items.length === 0}
              className="w-full bg-brand-orange-zest hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-xl transition-colors disabled:opacity-50"
            >
              {t("checkout")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}