export default function ServiceCard({ title, description, price, meta, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-2xl border transition ${
        selected
          ? "border-brand-orange-zest bg-brand-orange-light/30 shadow-md"
          : "border-brand-caramel-mousse/30 bg-white hover:border-brand-orange-zest/50"
      }`}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <h3 className="font-bold text-brand-dark-chocolate">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>
          )}
          {meta && <p className="text-xs text-gray-500 mt-1">{meta}</p>}
        </div>
        {price != null && (
          <span className="text-brand-orange-zest font-extrabold whitespace-nowrap">
            {price} zł
          </span>
        )}
      </div>
    </button>
  );
}