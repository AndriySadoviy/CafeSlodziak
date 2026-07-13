import useCartStore from "../lib/store/cartStore";
import { useTranslation } from "../lib/store/languageStore";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { t } = useTranslation();

  const translatedName = t(product.nameKey);
  const translatedDesc = t(product.descriptionKey);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white text-brand-dark-chocolate rounded-3xl shadow-lg border border-brand-caramel-mousse/20 flex flex-col"
    >
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-brand-dark-chocolate leading-snug">
          {translatedName}
        </h3>
        {translatedDesc && (
          <p className="text-sm text-gray-600 mt-2 flex-grow leading-relaxed">
            {translatedDesc}
          </p>
        )}
        <div className="mt-4 pt-4 border-t border-brand-caramel-mousse/20 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <span className="text-xl sm:text-2xl font-extrabold text-brand-orange-zest">
            {product.price} zł
          </span>
          <button
            onClick={() => addItem(product)}
            className="bg-brand-orange-zest hover:bg-orange-600 active:scale-95 text-white font-bold py-3 px-4 rounded-2xl transition-colors shadow-md text-sm w-full sm:w-auto min-h-[44px]"
          >
            {t("addToCart")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}