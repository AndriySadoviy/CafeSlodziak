import users from "../../../lib/data/users";
export default function handler(req, res) {
  const { email, password } = req.body;
  setTimeout(() => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      res.status(200).json({
        name: user.name,
        email: user.email,
        discount: user.discount,
        ordersIds: user.ordersIds,
        token: "mock-jwt-token",
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  }, 500);
}