export default function handler(req, res) {
  setTimeout(() => {
    const { name, email } = req.body;
    res.status(201).json({
      name,
      email,
      discount: 0,
      ordersIds: [],
      token: "mock-jwt-token-new",
    });
  }, 500);
}