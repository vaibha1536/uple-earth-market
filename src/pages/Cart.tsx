import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Add some products to get started</p>
          <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item, i) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 rounded-lg border bg-card p-4 shadow-card"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-24 w-24 rounded-lg object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link to={`/products/${item.product.id}`} className="font-display font-semibold hover:text-primary">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{item.product.pieces} pieces</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-lg border">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-2 hover:bg-muted">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-2 hover:bg-muted">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-semibold text-primary">₹{item.product.price * item.quantity}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="self-start p-1 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="h-fit rounded-lg border bg-card p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold">Order Summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items ({totalItems})</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-primary font-medium">Free</span>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg text-primary">₹{totalPrice}</span>
              </div>
            </div>
            <Button className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
