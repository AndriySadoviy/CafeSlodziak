const orders = [
  {
    id: 101,
    userId: "user1@example.com",
    items: [
      { productId: 1, quantity: 2, price: 25 },
      { productId: 4, quantity: 1, price: 18 },
    ],
    total: 68,
    pickupTime: "14:00",
    date: "2024-12-01",
    status: "completed",
  },
  {
    id: 102,
    userId: "user1@example.com",
    items: [
      { productId: 6, quantity: 3, price: 20 },
    ],
    total: 60,
    pickupTime: "16:30",
    date: "2024-12-08",
    status: "completed",
  },
];

export default orders;