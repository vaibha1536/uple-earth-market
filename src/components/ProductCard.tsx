import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const outOfStock = product.stock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="overflow-hidden rounded-lg border bg-card shadow-card transition-shadow hover:shadow-card-hover">
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <h3 className="font-display text-lg font-semibold leading-tight">{product.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{product.pieces} pieces</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-lg font-bold text-primary">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {outOfStock ? (
                <span className="font-medium text-destructive">Out of Stock</span>
              ) : (
                <span>{product.stock} in stock</span>
              )}
            </div>
            <Button
              onClick={handleAdd}
              disabled={outOfStock}
              className="mt-4 w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
