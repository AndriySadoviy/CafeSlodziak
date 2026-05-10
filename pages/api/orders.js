import orders from "../../lib/data/orders";

export default function handler(req, res) {
  const { userId } = req.query;
  setTimeout(() => {
    if (userId) {
      res.status(200).json(orders.filter(o => o.userId === userId));
    } else {
      res.status(200).json(orders);
    }
  }, 400);
}