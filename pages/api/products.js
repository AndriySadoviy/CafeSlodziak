import products from "../../lib/data/products";
export default function handler(req, res) {
  setTimeout(() => {
    res.status(200).json(products);
  }, 300);
}