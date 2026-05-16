-- Add payment_method enum
CREATE TYPE public.payment_method AS ENUM ('razorpay', 'cod');

-- Add payment_method column to orders
ALTER TABLE public.orders ADD COLUMN payment_method public.payment_method NOT NULL DEFAULT 'razorpay';