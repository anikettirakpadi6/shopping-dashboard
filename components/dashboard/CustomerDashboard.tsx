"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  X, 
  Loader2, 
  Package, 
  CheckCircle, 
  AlertTriangle 
} from "lucide-react";

type Props = {
  activeTab: string;
};

export default function CustomerDashboard({ activeTab }: Props) {
  return (
    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {activeTab === "shop" && <ShopSection />}
        {activeTab === "orders" && <OrdersSection />}
      </div>
    </div>
  );
}

function ShopSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((p) => p._id === product._id);

      if (existing) {
        if (existing.quantity >= product.quantity) {
          toast.error("Stock limit reached");
          return prev;
        }

        return prev.map((p) =>
          p._id === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      if (product.quantity === 0) {
        toast.error("Out of stock");
        return prev;
      }

      return [...prev, { ...product, quantity: 1 }];
    });
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
        .map((p) =>
          p._id === item._id
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
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
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success("Order placed successfully");
      setCart([]);
      setShowCart(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Shop Products</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Discover our latest essentials curated just for you.</p>
        </div>

        <button
          onClick={() => setShowCart(true)}
          className="relative flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all text-sm group"
        >
          <ShoppingBag size={18} className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
          <span>Cart</span>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950 animate-scale-up">
              {cart.reduce((total, p) => total + p.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-3">
          <Loader2 className="animate-spin text-indigo-600" size={36} />
          <p className="text-sm font-medium text-slate-500">Loading catalog items...</p>
        </div>
      )}

      {/* EMPTY CATALOGUE */}
      {!loading && products.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm max-w-md mx-auto mt-12">
          <Package className="mx-auto text-slate-400 mb-4" size={40} />
          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">No products available</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Check back later or refresh your collection.</p>
        </div>
      )}

      {/* RESPONSIBLY SCALED PRODUCT GRID */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.filter(Boolean).map((p: any) => {
            const cartItem = cart.find((c) => c._id === p._id);
            const isMaxed = cartItem && cartItem.quantity >= p.quantity;

            return (
              <div
                key={p._id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Image Wrap Container */}
                <div className="aspect-square w-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl mb-4 overflow-hidden p-3 relative">
                  <img
                    src={
                      p?.image && !p.image.startsWith("blob:")
                        ? p.image
                        : "https://via.placeholder.com/150"
                    }
                    alt={p.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 group-hover:scale-105"
                  />
                  {p.quantity === 0 && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs px-2.5 py-1 font-bold rounded-full uppercase tracking-wider">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Info Text Elements */}
                <div className="flex flex-col flex-grow">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{p.name}</h3>
                  <div className="flex items-baseline justify-between mt-1.5">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">₹{p.price}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.quantity === 0 
                          ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          : p.quantity < 5
                          ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center gap-1"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                      }`}
                    >
                      {p.quantity < 5 && p.quantity > 0 && <AlertTriangle size={10} />}
                      Stock: {p.quantity}
                    </span>
                  </div>
                </div>

                {/* Primary Interaction Call-To-Action */}
                <button
                  onClick={() => addToCart(p)}
                  disabled={p.quantity === 0 || isMaxed}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-sm focus:outline-none"
                >
                  {p.quantity === 0
                    ? "Out of Stock"
                    : isMaxed
                    ? "Max Allowed Reached"
                    : "Add to Cart"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* MODERN SLIDEOVER-STYLE CART MODAL OVERLAY */}
      {showCart && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-end z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-slate-900 dark:text-white" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Your Shopping Cart</h3>
              </div>
              <button 
                onClick={() => setShowCart(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                  <ShoppingBag size={48} className="text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="font-medium">Your cart feels light!</p>
                  <p className="text-xs text-slate-400 mt-0.5">Add items from the store to fulfill an order.</p>
                </div>
              )}

              {cart.length > 0 && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
                  {cart.map((c) => (
                    <div
                      key={c._id}
                      className="flex gap-4 items-center pt-4 first:pt-0 group animate-in fade-in"
                    >
                      <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center p-1.5 flex-shrink-0 border border-slate-100 dark:border-slate-700">
                        <img src={c.image && !c.image.startsWith("blob:") ? c.image : "https://via.placeholder.com/150"} alt={c.name} className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                      </div>

                      <div className="flex-grow min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{c.name}</p>
                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                          ₹{c.price}
                        </p>
                      </div>

                      {/* STEPPER CONTROLS */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden">
                          <button
                            onClick={() => decreaseQty(c)}
                            className="p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 min-w-[24px] text-center">{c.quantity}</span>
                          <button
                            onClick={() => increaseQty(c)}
                            className="p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(c._id)}
                          className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CART FOOTER METRICS AND ACTIONS */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Estimated Subtotal</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">₹{totalAmount}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersSection() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Orders</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review processing states, past invoice updates, and package deliveries.</p>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm max-w-md mx-auto mt-12">
          <CheckCircle className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={40} />
          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">No orders yet</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Any purchases you fulfill inside the store tracker will populate logs here.</p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((o) => {
          // Status context style assignments
          const isCompleted = o.status?.toLowerCase() === "delivered" || o.status?.toLowerCase() === "completed";
          const isPending = o.status?.toLowerCase() === "pending" || o.status?.toLowerCase() === "processing";

          return (
            <div 
              key={o._id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Reference Identifier</span>
                <p className="text-sm font-mono font-medium text-slate-900 dark:text-white select-all">{o._id}</p>
                <div className="pt-2 flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>Gross Total Amount: <strong className="text-slate-900 dark:text-white font-bold text-sm">₹{o.totalAmount}</strong></span>
                </div>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase hidden sm:block mb-1">Fulfillment State</span>
                <span 
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    isCompleted
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      : isPending
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isCompleted ? "bg-emerald-500" : isPending ? "bg-amber-500" : "bg-slate-400"}`} />
                  {o.status || "Unknown"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}