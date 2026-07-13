import { useState, useEffect } from "react";
import useAuthStore from "../lib/store/authStore";
import { useTranslation } from "../lib/store/languageStore";
import { motion } from "framer-motion";

export default function Account() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Стан для замовлень із реальної бази
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Завантаження замовлень з API при зміні користувача
  useEffect(() => {
    if (user) {
      fetchOrders(user.id);
    } else {
      setOrders([]);
    }
  }, [user]);

  const fetchOrders = async (userId) => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Якщо користувач авторизований – показуємо його кабінет
  if (user) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark-chocolate mb-4 sm:mb-6">
          {t("personalAccount")}
        </h1>

        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg mb-6 sm:mb-8 border border-brand-caramel-mousse/20">
          <p className="text-xl text-brand-dark-chocolate">
            {t("welcome") || "Witaj"}, <strong>{user.name}</strong>!
          </p>
          <p className="text-brand-dark-chocolate">Email: {user.email}</p>
          <p className="text-brand-dark-chocolate">
            {t("discount")}: <span className="font-bold text-brand-orange-zest">{user.discount}%</span>
          </p>
          <button
            onClick={logout}
            className="mt-4 border border-brand-caramel-mousse text-brand-caramel-mousse px-4 py-2 rounded-xl hover:bg-brand-caramel-mousse hover:text-white transition"
          >
            {t("logout")}
          </button>
        </div>

        <h2 className="text-2xl font-bold text-brand-dark-chocolate mb-4">
          {t("orderHistory")}
        </h2>

        {ordersLoading && <p className="text-gray-500">Ładowanie zamówień...</p>}

        {!ordersLoading && orders.length === 0 && (
          <p className="text-brand-dark-chocolate">{t("noOrders")}</p>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-2xl shadow border border-brand-caramel-mousse/20"
            >
              <p className="font-bold text-brand-dark-chocolate">
                Zamówienie #{order.id} – {order.createdAt?.slice(0, 10)}
              </p>
              <p className="text-sm text-gray-500">Status: {order.status}</p>
              <p className="text-sm text-gray-500">Odbiór: {order.pickupTime}</p>
              <p className="text-sm text-gray-500">Suma: {order.total} zł</p>
              <ul className="list-disc ml-6 text-gray-600">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.nameKey || `Produkt ${idx + 1}`} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Форма входу / реєстрації (як було)
  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-12">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-brand-caramel-mousse/20"
      >
        <div className="flex justify-around mb-6">
          <button
            onClick={() => setMode("login")}
            className={`text-lg font-bold pb-1 border-b-4 transition-all ${
              mode === "login"
                ? "border-brand-orange-zest text-brand-orange-zest"
                : "border-transparent text-brand-dark-chocolate"
            }`}
          >
            {t("login")}
          </button>
          <button
            onClick={() => setMode("register")}
            className={`text-lg font-bold pb-1 border-b-4 transition-all ${
              mode === "register"
                ? "border-brand-orange-zest text-brand-orange-zest"
                : "border-transparent text-brand-dark-chocolate"
            }`}
          >
            {t("register")}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              placeholder={t("name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-brand-caramel-mousse"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-brand-caramel-mousse"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-brand-caramel-mousse"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange-zest hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-xl transition-colors"
          >
            {loading ? "..." : mode === "login" ? t("login") : t("register")}
          </button>
        </form>
        {mode === "login" && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            Demo: user1@example.com / password123
          </p>
        )}
      </motion.div>
    </div>
  );
}