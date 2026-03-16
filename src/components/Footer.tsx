import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t bg-card">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-primary">Uple</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Handmade, 100% natural cow dung cakes for puja, havan & spiritual rituals. Supporting rural livelihoods.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">Home</Link>
            <Link to="/products" className="text-sm text-muted-foreground hover:text-primary">Products</Link>
            <Link to="/cart" className="text-sm text-muted-foreground hover:text-primary">Cart</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Contact</h4>
          <p className="text-sm text-muted-foreground">support@uple.in</p>
          <p className="text-sm text-muted-foreground">+91 98765 43210</p>
        </div>
      </div>
      <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Uple. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
