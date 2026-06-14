import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react"; // or your auth provider
import { toast } from "react-hot-toast"; // assuming you are using react-hot-toast

export function useShop() {
  const { data: session } = useSession();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    upiId: "",
    walletNumber: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setCartLoaded(true);
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;
    if (cart.length === 0) {
      localStorage.removeItem("cart");
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, cartLoaded]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || data || []);
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    if (!products) return ["All"];
    const uniqueCategories = new Set(
      products
        .filter(Boolean)
        .map((p: any) => p.categoryId?.name)
        .filter(Boolean)
    );
    return ["All", ...Array.from(uniqueCategories)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const validProducts = products.filter(Boolean);
    if (selectedCategory === "All") return validProducts;
    return validProducts.filter((p: any) => p.categoryId?.name === selectedCategory);
  }, [products, selectedCategory]);

  const addToCart = (product: any) => {
    const existing = cart.find((p) => p._id === product._id);

    if (existing) {
      if (existing.quantity >= product.quantity) {
        toast.error("Stock limit reached");
        return;
      }
      setCart((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
      toast.success(`${product.name} quantity updated`);
      return;
    }

    if (product.quantity === 0) {
      toast.error("Out of stock");
      return;
    }

    setCart((prev) => [...prev, { ...product, quantity: 1 }]);
    toast.success(`${product.name} added to cart`);
  };

  const increaseQty = (item: any) => {
    const product = products.find((p) => p._id === item._id);
    setCart((prev) =>
      prev.map((p) => {
        if (p._id !== item._id) return p;
        if (p.quantity >= product.quantity) {
          toast.error("Stock limit reached");
          return p;
        }
        return { ...p, quantity: p.quantity + 1 };
      })
    );
  };

  const decreaseQty = (item: any) => {
    setCart((prev) =>
      prev
        .map((p) => (p._id === item._id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      const phoneRegex = /^[6-9]\d{9}$/;
      const pincodeRegex = /^\d{6}$/;

      if (!phoneRegex.test(checkoutData.phone)) {
        toast.error("Enter valid 10 digit phone number");
        return;
      }
      if (!pincodeRegex.test(checkoutData.pincode)) {
        toast.error("Enter valid 6 digit pincode");
        return;
      }
      if (
        !checkoutData.fullName ||
        !checkoutData.phone ||
        !checkoutData.address ||
        !checkoutData.city ||
        !checkoutData.pincode
      ) {
        toast.error("Please fill all checkout details");
        return;
      }

      if (checkoutData.paymentMethod === "card") {
        const cardRegex = /^\d{16}$/;
        const cvvRegex = /^\d{3}$/;

        if (!cardRegex.test(checkoutData.cardNumber)) {
          toast.error("Card number must be 16 digits");
          return;
        }
        if (!checkoutData.cardName.trim()) {
          toast.error("Enter card holder name");
          return;
        }
        if (!cvvRegex.test(checkoutData.cvv)) {
          toast.error("Invalid CVV");
          return;
        }
      }

      if (checkoutData.paymentMethod === "upi") {
        const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;
        if (!upiRegex.test(checkoutData.upiId)) {
          toast.error("Invalid UPI ID");
          return;
        }
      }

      if (checkoutData.paymentMethod === "wallet") {
        const walletRegex = /^[6-9]\d{9}$/;
        if (!walletRegex.test(checkoutData.walletNumber)) {
          toast.error("Invalid wallet number");
          return;
        }
      }

      setProcessingPayment(true);
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const paymentRes = await fetch("/api/payments/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok || !paymentData.success) {
        throw new Error(paymentData.error || "Payment failed");
      }

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          items: cart,
          totalAmount,
          address: `${checkoutData.address}, ${checkoutData.city} - ${checkoutData.pincode}`,
          paymentStatus: "paid",
          payment: {
            method: checkoutData.paymentMethod,
            transactionId: paymentData.transactionId,
            paidAt: paymentData.paidAt,
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Order creation failed");
      }

      toast.success("Payment successful & order placed");
      setCart([]);
      setShowCart(false);
      setShowCheckout(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setProcessingPayment(false);
    }
  };

  return {
    products,
    loading,
    cart,
    showCart,
    setShowCart,
    showCheckout,
    setShowCheckout,
    checkoutData,
    setCheckoutData,
    processingPayment,
    addToCart,
    increaseQty,
    decreaseQty,
    removeItem,
    totalAmount,
    handleCheckout,
    selectedCategory,    
    setSelectedCategory, 
    categories,         
    filteredProducts
  };
}