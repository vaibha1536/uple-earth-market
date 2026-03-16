import { Product } from "@/context/CartContext";
import product10 from "@/assets/product-10.jpg";
import product25 from "@/assets/product-25.jpg";
import product50 from "@/assets/product-50.jpg";

export const products: Product[] = [
  {
    id: "uple-10",
    name: "Uple Pack – 10 Pieces",
    description: "Handmade cow dung cakes, sun-dried and 100% natural. Perfect for daily puja rituals, havan, and small ceremonies. Made from desi cow dung with no chemical additives.",
    price: 99,
    originalPrice: 149,
    stock: 150,
    image: product10,
    pieces: 10,
    benefits: [
      "100% natural & chemical-free",
      "Sun-dried for optimal burning",
      "Purifies the air during havan",
      "Eco-friendly & biodegradable",
      "Made from desi cow dung",
    ],
  },
  {
    id: "uple-25",
    name: "Uple Pack – 25 Pieces",
    description: "Our popular value pack of 25 handmade cow dung cakes. Ideal for regular puja, havan ceremonies, and spiritual rituals. Long-lasting and produces aromatic smoke.",
    price: 199,
    originalPrice: 299,
    stock: 100,
    image: product25,
    pieces: 25,
    benefits: [
      "Best value for regular use",
      "100% natural & chemical-free",
      "Long-lasting burn time",
      "Aromatic & purifying smoke",
      "Supports rural artisans",
    ],
  },
  {
    id: "uple-50",
    name: "Uple Pack – 50 Pieces",
    description: "Bulk pack of 50 premium cow dung cakes for families and temples. Perfect for large havans, festivals, and regular spiritual practices. Best value per piece.",
    price: 349,
    originalPrice: 499,
    stock: 60,
    image: product50,
    pieces: 50,
    benefits: [
      "Best price per piece",
      "Perfect for temples & large families",
      "100% natural & sustainable",
      "Premium quality desi cow dung",
      "Eco-friendly packaging",
    ],
  },
];
