import { useState } from "react";
import useAuthStore from "../lib/store/authStore";
import { useTranslation } from "../lib/store/languageStore";
import { motion } from "framer-motion";

export default function Account() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const orders = useAuthStore((s) => s.orders);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  if (user) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-brand-dark-chocolate mb-6">{t("personalAccount")}</h1>
        <div className="bg-white p-6 rounded-3xl shadow-lg mb-8 border border-brand-caramel-mousse/20">
          <p className="text-xl text-brand-dark-chocolate">
            {t("welcome") || "Welcome"}, <strong>{user.name}</strong>!
          </p>
          <p className="text-brand-dark-chocolate">Email: {user.email}</p>
          <p className="text-brand-dark-chocolate">
            {t("discount")}: <span className="font-bold text-brand-orange-zest">{user.discount}%</span>
          </p>
        </div>
        <h2 className="text-2xl font-bold text-brand-dark-chocolate mb-4">{t("orderHistory")}</h2>
        {orders.length === 0 ? (
          <p className="text-brand-dark-chocolate">{t("noOrders")}</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-2xl shadow border border-brand-caramel-mousse/20">
                <p className="font-bold text-brand-dark-chocolate">№{order.id} - {order.date}</p>
                <ul className="list-disc ml-6 text-brand-dark-chocolate">
                  {order.items.map((item, idx) => (
                    <li key={idx}>{t(item.nameKey || item.productId)} x{item.quantity}</li>
                  ))}
                </ul>
                <p className="text-brand-dark-chocolate">
                  {t("total")}: {order.total} zł | Status: {order.status === "completed" ? "Completed" : "Processing"}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-8 rounded-3xl shadow-2xl border border-brand-caramel-mousse/20"
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