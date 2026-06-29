"use client";

import { useEffect, useState, useRef } from "react";
import { useShop } from "@/app/hooks/useShop";
import { ShoppingCartDrawer } from "../ShoppingCartDrawer";
import { CheckoutModal } from "../CheckoutModal";
import { OrderCard } from "../OrderCard";
import {
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";
import {
  ShoppingBag,
  Sparkles,
  Loader2,
  Package,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

type Props = {
  activeTab: string;
};

export default function CustomerDashboard({ activeTab }: Props) {
  return (
    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {activeTab === "products" && <ShopSection />}
        {activeTab === "orders" && <OrdersSection />}
      </div>
    </div>
  );
}

function ShopSection() {
  const {
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
    filteredProducts,
  } = useShop();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedId = searchParams.get("id");

  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!selectedId) return;

    const el = productRefs.current[selectedId];

    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const timer = setTimeout(() => {
      router.replace(`${pathname}?tab=products`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [selectedId, filteredProducts]);

  return (
  <div className="space-y-6 animate-in fade-in duration-300">
    {/* HEADER */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
      <div className="flex items-start gap-4">
        {/* ICON WRAPPER */}
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0 mt-0.5">
          <Sparkles size={24} strokeWidth={2} />
        </div>

        {/* TEXT CONTENT */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Shop Products
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Discover our latest essentials curated just for you.
          </p>
        </div>
      </div>

      <button
        onClick={() => setShowCart(true)}
        className="relative flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all text-sm group"
      >
        <ShoppingBag
          size={18}
          className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
        />
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
        <p className="text-sm font-medium text-slate-500">
          Loading catalog items...
        </p>
      </div>
    )}

    {/* EMPTY CATALOGUE */}
    {!loading && products.length === 0 && (
      <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm max-w-md mx-auto mt-12">
        <Package className="mx-auto text-slate-400 mb-4" size={40} />
        <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
          No products available
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Check back later or refresh your collection.
        </p>
      </div>
    )}

    {/* CATEGORY NAVIGATION BAR */}
      {!loading && products && products.length > 0 && (
        <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100 dark:shadow-none"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      )}

    {/* RESPONSIBLY SCALED PRODUCT GRID */}
    {!loading && filteredProducts.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((p: any) => {
          const cartItem = cart.find((c) => c._id === p._id);
          const isMaxed = cartItem && cartItem.quantity >= p.quantity;

          return (
            <div
              key={p._id}
              ref={(el) => {
                productRefs.current[p._id] = el;
              }}
              className={`
                group relative flex flex-col overflow-hidden rounded-2xl
                p-4 shadow-sm hover:shadow-md transition-all duration-500
                ${
                  selectedId === p._id
                    ? "ring-4 ring-blue-500 bg-blue-50 dark:bg-slate-800 scale-[1.02]"
                    : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                }
              `}
            >
              {/* Image Wrap Container */}
              <div className="aspect-square w-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl mb-4 overflow-hidden p-3 relative">
                <img
                  src={p?.image && !p.image.startsWith("blob:") ? p.image : "https://via.placeholder.com/150"}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 group-hover:scale-105"
                />
                {p.quantity === 0 && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs px-2.5 py-1 font-bold rounded-full uppercase tracking-wider">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Info Text Elements */}
              <div className="flex flex-col flex-grow">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {p.name}
                </h3>
                <div className="flex items-baseline justify-between mt-1.5">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    ₹{p.price}
                  </p>
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
                {p.quantity === 0 ? "Out of Stock" : isMaxed ? "Max Allowed Reached" : "Add to Cart"}
              </button>
            </div>
          );
        })}
      </div>
    )}

    {/* ABSTRACTED EXTRACTED UI ELEMENTS */}
    <ShoppingCartDrawer
      isOpen={showCart}
      onClose={() => setShowCart(false)}
      cart={cart}
      totalAmount={totalAmount}
      increaseQty={increaseQty}
      decreaseQty={decreaseQty}
      removeItem={removeItem}
      onCheckout={() => {
        setShowCart(false);
        setShowCheckout(true);
      }}
    />

    <CheckoutModal
      isOpen={showCheckout}
      onClose={() => setShowCheckout(false)}
      cart={cart}
      totalAmount={totalAmount}
      checkoutData={checkoutData}
      setCheckoutData={setCheckoutData}
      processingPayment={processingPayment}
      onPaymentSubmit={handleCheckout}
    />
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
    {/* HEADER */}
    <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex items-start gap-4">
      {/* ICON WRAPPER */}
      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0 mt-0.5">
        <ShoppingBag size={24} strokeWidth={2} />
      </div>

      {/* TEXT CONTENT */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Orders
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
          Review processing states, past invoice updates, and package deliveries.
        </p>
      </div>
    </div>

    {/* EMPTY ORDERS STATE */}
    {orders.length === 0 && (
      <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm max-w-md mx-auto mt-12">
        <CheckCircle
          className="mx-auto text-slate-300 dark:text-slate-700 mb-4"
          size={40}
        />
        <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
          No orders yet
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Any purchases you fulfill inside the store tracker will populate logs here.
        </p>
      </div>
    )}

    {/* ORDERS LIST */}
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  </div>
);
}
