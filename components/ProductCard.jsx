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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col"
    >
      <img
        src={product.image}
        alt={translatedName}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
        }}
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-brand-dark-chocolate">{translatedName}</h3>
        <p className="text-sm text-gray-600 mt-1 flex-grow">{translatedDesc}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-2xl font-extrabold text-brand-orange-zest">{product.price} zł</span>
          <button
            onClick={() => addItem(product)}
            className="bg-brand-orange-zest hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-2xl transition-colors shadow-md"
          >
            {t("addToCart")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}