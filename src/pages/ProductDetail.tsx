import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Minus, Plus, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    addToCart(product, quantity);
    toast.success(`${quantity}x ${product.name} added to cart`);
  };

  return (
    <Layout>
      <div className="container py-8">
        <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-lg border bg-card"
          >
            <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{product.pieces} pieces per pack</p>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {outOfStock ? (
                <span className="font-medium text-destructive">Out of Stock</span>
              ) : (
                <span>{product.stock} in stock</span>
              )}
            </p>

            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

            {/* Benefits */}
            <div className="mt-6">
              <h3 className="mb-3 font-display text-lg font-semibold">Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map(b => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-lg border">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 hover:bg-muted"
                  disabled={outOfStock}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="p-3 hover:bg-muted"
                  disabled={outOfStock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={handleAdd}
                disabled={outOfStock}
                size="lg"
                className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            <Button
              asChild
              disabled={outOfStock}
              size="lg"
              className="mt-3 w-full"
            >
              <Link to="/cart" onClick={handleAdd}>Buy Now</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
