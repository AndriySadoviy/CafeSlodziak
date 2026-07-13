import useCartStore from "../lib/store/cartStore";
import { useTranslation } from "../lib/store/languageStore";

export default function CartItem({ item }) {
  const increase = useCartStore((s) => s.increaseQuantity);
  const decrease = useCartStore((s) => s.decreaseQuantity);
  const remove = useCartStore((s) => s.removeItem);
  const { t } = useTranslation();
  const name = t(item.nameKey);
  const desc = t(item.descriptionKey);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white text-brand-dark-chocolate p-4 rounded-2xl shadow mb-4">
      <div className="flex-1 min-w-0 sm:pr-4">
        <h4 className="font-bold text-lg text-brand-dark-chocolate">{name}</h4>
        {desc && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{desc}</p>}
        <p className="text-brand-orange-zest font-bold mt-1">{item.price} zł</p>
      </div>
      <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => decrease(item.id)}
            className="bg-gray-200 w-11 h-11 rounded-full font-bold text-lg active:scale-95"
          >
            −
          </button>
          <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
          <button
            onClick={() => increase(item.id)}
            className="bg-gray-200 w-11 h-11 rounded-full font-bold text-lg active:scale-95"
          >
            +
          </button>
        </div>
        <button
          onClick={() => remove(item.id)}
          className="text-red-500 hover:text-red-700 ml-2"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}