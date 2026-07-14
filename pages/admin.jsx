import { useState, useEffect } from 'react';
import useAuthStore from '../lib/store/authStore';

// Допоміжна функція – визначає категорію за nameKey позиції
const getItemCategory = (nameKey) => {
  if (!nameKey) return 'other';
  if (nameKey.startsWith('cake_')) return 'cakes';
  const key = nameKey.toLowerCase();
  if (key.includes('pizza')) return 'pizza';
  if (
    key.includes('jajecznica') ||
    key.includes('grzanki') ||
    key.includes('szakszuka') ||
    key.includes('bajgiel') ||
    key.includes('omlet') ||
    key.includes('angielski') ||
    key.includes('serniczki') ||
    key.includes('panini') ||
    key.includes('makaron') ||
    key.includes('pasta') ||
    key.includes('pierogi') ||
    key.includes('nuggets') ||
    key.includes('kurczak') ||
    key.includes('salatka') ||
    key.includes('tost') ||
    key.includes('zupa') ||
    key.includes('lunch')
  )
    return 'main';
  if (
    key.includes('smoothie') ||
    key.includes('cocoa') ||
    key.includes('kakao') ||
    key.includes('lemoniada') ||
    key.includes('ice tea') ||
    key.includes('iced latte') ||
    key.includes('iced matcha') ||
    key.includes('kompot')
  )
    return 'drinks';
  if (
    key.includes('icecream') ||
    key.includes('lody') ||
    key.includes('pancakes') ||
    key.includes('naleśniki') ||
    key.includes('deser') ||
    key.includes('ciasto') ||
    key.includes('cookie')
  )
    return 'desserts';
  return 'other';
};

// Форматування дати
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function Admin() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Перший фільтр – статус
  const [statusFilter, setStatusFilter] = useState('new');
  // Другий фільтр – категорія страви
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchOrders();
    } catch (err) {
      alert('Nie udało się zaktualizować statusu: ' + err.message);
    }
  };

  // Фільтрація за статусом + категорією
  const filteredOrders = orders.filter((order) => {
    if (order.status !== statusFilter) return false;
    if (categoryFilter === 'all') return true;
    return order.items.some((item) => getItemCategory(item.nameKey) === categoryFilter);
  });

  // Відображення позиції замовлення
  const renderItem = (item, idx) => {
    const category = getItemCategory(item.nameKey);
    // Для тортів показуємо деталі
    if (category === 'cakes') {
      const details = item.cakeDetails || {};
      return (
        <li key={idx} className="ml-4 bg-blue-50 p-2 rounded-xl mt-1 list-none text-sm text-gray-700">
          🎂 <strong>Zamówienie tortu</strong><br />
          Smak: {details.flavor || '—'}<br />
          Dziecko: {details.childName || '—'}<br />
          Telefon: {details.phone || '—'}<br />
          Data: {details.date || '—'}<br />
          {details.message && <>Uwagi: {details.message}<br /></>}
          Cena: {item.price} zł
        </li>
      );
    }
    return (
      <li key={idx}>
        {item.nameKey || `Produkt ${idx + 1}`} × {item.quantity}
      </li>
    );
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl text-brand-dark-chocolate">Brak dostępu</h1>
        <p className="mt-4">Tylko administrator może przeglądać tę stronę.</p>
      </div>
    );
  }

  // Масиви для кнопок фільтрів
  const statuses = [
    { key: 'new', label: 'Nowe' },
    { key: 'completed', label: 'Zrealizowane' },
    { key: 'cancelled', label: 'Odwołane' },
  ];
  const categories = [
    { key: 'all', label: 'Wszystkie' },
    { key: 'pizza', label: 'Pizza' },
    { key: 'main', label: 'Dania główne' },
    { key: 'desserts', label: 'Desery' },
    { key: 'cakes', label: 'Torty' },
    { key: 'drinks', label: 'Napoje' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark-chocolate mb-8">
        Panel administratora – Zamówienia
      </h1>

      {/* Ряд фільтрів: спочатку статуси */}
      <div className="flex flex-wrap gap-2 mb-4">
        {statuses.map((s) => (
          <button
            key={s.key}
            onClick={() => { setStatusFilter(s.key); setCategoryFilter('all'); }}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              statusFilter === s.key
                ? 'bg-brand-orange-zest text-white shadow'
                : 'bg-white text-brand-dark-chocolate border border-brand-caramel-mousse'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Другий ряд: категорії */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategoryFilter(c.key)}
            className={`px-3 py-1 rounded-xl text-sm font-medium transition ${
              categoryFilter === c.key
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Ładowanie zamówień...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-2xl mb-6">
          <p>Błąd: {error}</p>
          <button onClick={fetchOrders} className="mt-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition">
            Spróbuj ponownie
          </button>
        </div>
      )}

      {!loading && !error && filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow">
          <p className="text-xl text-gray-500">Brak zamówień w tej kategorii.</p>
        </div>
      )}

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-lg font-bold text-brand-dark-chocolate">
                  Zamówienie #{order.id}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'new'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.status === 'new' ? 'Nowe' : order.status === 'completed' ? 'Zrealizowane' : 'Odwołane'}
                </span>
              </div>
              <p className="text-gray-700">
                <span className="font-medium">Klient:</span>{' '}
                {order.customerName || order.user?.name || 'Gość'}
              </p>
              {order.customerPhone && (
                <p className="text-gray-700">
                  <span className="font-medium">Telefon:</span> {order.customerPhone}
                </p>
              )}
              {order.paymentMethod && (
                <p className="text-gray-700">
                  <span className="font-medium">Płatność:</span>{' '}
                  {order.paymentMethod}
                  {order.paymentSuccess ? ' ✅' : ' ❌'}
                </p>
              )}
              <p className="text-gray-700">
                <span className="font-medium">Data zamówienia:</span>{' '}
                {formatDate(order.createdAt)}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Kwota:</span> {order.total} zł
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Odbiór:</span> {order.pickupTime}
              </p>


                   {order.comment && (
  <p className="text-gray-700 mt-2">
    <span className="font-medium">Uwagi:</span> {order.comment}
  </p>
)}


              <div className="mt-2">
                <span className="font-medium text-gray-700">Pozycje:</span>
                <ul className="text-gray-600 mt-1 list-disc list-inside">
                  {order.items.map((item, idx) => renderItem(item, idx))}
                </ul>
              </div>
          
  
            </div>
            <div className="md:ml-4 w-full md:w-auto">
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="w-full md:w-auto border border-brand-caramel-mousse rounded-xl p-2.5 bg-white text-brand-dark-chocolate focus:outline-none focus:ring-2 focus:ring-brand-orange-zest"
              >
                {statuses.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}