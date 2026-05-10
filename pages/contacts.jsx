import { motion } from "framer-motion";
import { useTranslation } from "../lib/store/languageStore";

export default function Contacts() {
  const { t } = useTranslation();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-brand-dark-chocolate mb-8">{t("contacts")}</h1>
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-brand-caramel-mousse/20 space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-brand-dark-chocolate">{t("address")}</h3>
          <p className="text-brand-dark-chocolate">{t("address")}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-brand-dark-chocolate">{t("phoneNumber")}</h3>
          <p className="text-brand-dark-chocolate">{t("phoneNumber")}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-brand-dark-chocolate">{t("workingHours")}</h3>
          <p className="text-brand-dark-chocolate">{t("workingHours")}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-brand-dark-chocolate">{t("kidsZone")}</h3>
          <p className="text-brand-dark-chocolate">{t("kidsZone")}</p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=400&fit=crop"
          alt="Map"
          className="rounded-2xl w-full h-60 object-cover"
        />
      </div>
    </motion.div>
  );
}