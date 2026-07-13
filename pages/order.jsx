import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "../lib/store/languageStore";

export default function OrderSuccess() {
  const { t } = useTranslation();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 sm:py-20 px-4">
      <h1 className="text-2xl sm:text-4xl font-bold text-green-600 mb-4">{t("orderSuccess")}</h1>
      <p className="text-base sm:text-xl text-gray-700 mb-8">{t("orderSuccessDesc")}</p>
      <Link href="/menu">
        <button className="bg-kids-blue hover:bg-blue-400 text-white font-bold py-3 px-6 sm:px-8 rounded-3xl text-base sm:text-lg shadow-lg min-h-[44px]">
          {t("viewMenu")}
        </button>
      </Link>
    </motion.div>
  );
}