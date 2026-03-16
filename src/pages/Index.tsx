import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Flame, Heart, Truck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import heroImage from "@/assets/hero-uple.jpg";

const features = [
  { icon: Leaf, title: "100% Natural", desc: "Made from pure desi cow dung, no chemicals" },
  { icon: Flame, title: "Perfect for Havan", desc: "Sun-dried for clean, aromatic burning" },
  { icon: Heart, title: "Eco-Friendly", desc: "Biodegradable and sustainable" },
  { icon: Truck, title: "Pan-India Delivery", desc: "Fast shipping across India" },
];

const reviews = [
  { name: "Priya S.", rating: 5, text: "Excellent quality! Burns cleanly and the aroma is wonderful. Perfect for our daily puja." },
  { name: "Rajesh K.", rating: 5, text: "Best cow dung cakes I've found online. Packaging was great and delivery was fast." },
  { name: "Sunita M.", rating: 4, text: "Very satisfied with the product. Will order the 50 pack next time for the festivals." },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container grid items-center gap-8 py-16 md:grid-cols-2 md:py-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              🌿 100% Natural & Handmade
            </span>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Pure Cow Dung Cakes for Sacred Rituals
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Handcrafted by rural artisans, sun-dried to perfection. Bring the purity of nature to your puja and havan.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/products">View Products</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="overflow-hidden rounded-lg"
          >
            <img src={heroImage} alt="Handmade cow dung cakes" className="w-full rounded-lg object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-card">
        <div className="container grid grid-cols-2 gap-6 py-12 md:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-sm font-semibold md:text-base">{f.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold md:text-4xl">Our Products</h2>
            <p className="mt-2 text-muted-foreground">Choose the perfect pack for your needs</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t bg-card py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold md:text-4xl">Customer Reviews</h2>
            <p className="mt-2 text-muted-foreground">Trusted by thousands of happy customers</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-lg border bg-background p-6 shadow-card"
              >
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{r.text}</p>
                <p className="mt-4 text-sm font-semibold">{r.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-lg bg-primary p-8 text-center text-primary-foreground md:p-12"
          >
            <h2 className="text-2xl font-bold md:text-3xl">Ready to Order?</h2>
            <p className="mt-2 opacity-90">Get pure, handmade cow dung cakes delivered to your doorstep.</p>
            <Button asChild size="lg" className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/products">Order Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
