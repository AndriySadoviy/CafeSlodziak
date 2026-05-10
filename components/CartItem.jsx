import useCartStore from "../lib/store/cartStore";
import { useTranslation } from "../lib/store/languageStore";

export default function CartItem({ item }) {
  const increase = useCartStore((s) => s.increaseQuantity);
  const decrease = useCartStore((s) => s.decreaseQuantity);
  const remove = useCartStore((s) => s.removeItem);
  const { t } = useTranslation();
  const name = t(item.nameKey);

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow mb-4">
      <div className="flex items-center space-x-4">
        <img src={item.image} alt={name} className="w-20 h-20 object-cover rounded-xl" onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }} />
        <div>
          <h4 className="font-bold text-lg">{name}</h4>
          <p className="text-pink-600 font-bold">{item.price} zł</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <button onClick={() => decrease(item.id)} className="bg-gray-200 w-8 h-8 rounded-full font-bold">−</button>
          <span className="w-8 text-center font-bold">{item.quantity}</span>
          <button onClick={() => increase(item.id)} className="bg-gray-200 w-8 h-8 rounded-full font-bold">+</button>
        </div>
        <button onClick={() => remove(item.id)} className="text-red-500 hover:text-red-700 ml-2">🗑️</button>
      </div>
    </div>
  );
}