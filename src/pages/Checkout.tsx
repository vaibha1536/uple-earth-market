import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Loader2, CheckCircle, Banknote, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PaymentMethod = "razorpay" | "cod";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Load profile data
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          email: user.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
        }));
      } else {
        setForm((prev) => ({ ...prev, email: user.email || "" }));
      }
    };
    loadProfile();
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast({ title: "Please sign in", description: "You need to sign in to checkout.", variant: "destructive" });
      navigate("/auth");
    }
  }, [user, authLoading, navigate, toast]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  if (items.length === 0 && !orderPlaced) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const required = ["name", "email", "phone", "address", "city", "state", "pincode"] as const;
    for (const field of required) {
      if (!form[field].trim()) {
        toast({ title: "Missing field", description: `Please fill in ${field}`, variant: "destructive" });
        return false;
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast({ title: "Invalid email", variant: "destructive" });
      return false;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast({ title: "Invalid pincode", description: "Pincode must be 6 digits", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      // Step 1: Create order via edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "create-razorpay-order",
        {
          body: {
            amount: totalPrice,
            items: items.map((i) => ({
              product_id: i.product.id,
              product_name: i.product.name,
              price: i.product.price,
              quantity: i.quantity,
            })),
            shipping_info: form,
          },
        }
      );

      if (orderError) throw new Error(orderError.message);
      if (orderData?.error) throw new Error(orderData.error);

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderData.razorpay_key,
        amount: orderData.amount,
        currency: "INR",
        name: "Uple",
        description: "Cow Dung Cakes Order",
        order_id: orderData.razorpay_order_id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#4a7c59" },
        handler: async (response: any) => {
          // Step 3: Verify payment
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: orderData.order_id,
                },
              }
            );

            if (verifyError) throw new Error(verifyError.message);
            if (verifyData?.error) throw new Error(verifyData.error);

            setOrderNumber(orderData.order_number);
            setOrderPlaced(true);
            clearCart();
            toast({ title: "Order placed!", description: `Order ${orderData.order_number} confirmed.` });
          } catch (err: any) {
            toast({ title: "Payment verification failed", description: err.message, variant: "destructive" });
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast({ title: "Payment cancelled", variant: "destructive" });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const handleCODOrder = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const orderNumber = `UPLE-${Date.now().toString(36).toUpperCase()}`;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user!.id,
          order_number: orderNumber,
          subtotal: totalPrice,
          shipping: 0,
          total: totalPrice,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          payment_method: "cod",
          payment_status: "pending",
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      setOrderNumber(orderNumber);
      setOrderPlaced(true);
      clearCart();
      toast({ title: "Order placed!", description: `Order ${orderNumber} confirmed. Pay on delivery.` });
    } catch (err: any) {
      console.error("COD order error:", err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "cod") {
      handleCODOrder();
    } else {
      handlePayment();
    }
  };

  if (orderPlaced) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <CheckCircle className="mx-auto mb-4 h-20 w-20 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">Order Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">Your order <strong>{orderNumber}</strong> has been placed successfully.</p>
          <p className="mt-1 text-sm text-muted-foreground">You will receive a confirmation email shortly.</p>
          <Button asChild className="mt-8">
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <Link to="/cart" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Cart
        </Link>
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Shipping Form */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-lg border bg-card p-6 shadow-card">
              <h3 className="mb-4 font-display text-lg font-semibold">Shipping Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Your phone number" required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Street address" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" value={form.city} onChange={handleChange} placeholder="City" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" name="state" value={form.state} onChange={handleChange} placeholder="State" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input id="pincode" name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" required />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="h-fit space-y-4">
            <div className="rounded-lg border bg-card p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold">Order Summary</h3>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-primary">Free</span>
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg text-primary">₹{totalPrice}</span>
                </div>
              </div>
              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  <><CreditCard className="mr-2 h-4 w-4" /> Pay ₹{totalPrice}</>
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Secured by Razorpay. 100% safe & encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
