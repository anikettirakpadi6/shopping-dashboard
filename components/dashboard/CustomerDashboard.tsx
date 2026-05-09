"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Props = {
  activeTab: string;
};

export default function CustomerDashboard({ activeTab }: Props) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 text-black dark:text-white min-h-screen">
      {activeTab === "shop" && <ShopSection />}
      {activeTab === "orders" && <OrdersSection />}
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

  // INCREMENT
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

  // DECREMENT
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

  // REMOVE
  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // CHECKOUT
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
      fetchProducts(); // refresh stock
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Shop Products</h2>

        <button
          onClick={() => setShowCart(true)}
          className="px-4 py-2 border rounded"
        >
          Cart ({cart.length})
        </button>
      </div>

      {/* EMPTY */}
      {!loading && products.length === 0 && (
        <div className="text-center py-20 border rounded-xl">
          <p>No products available</p>
        </div>
      )}

      {/* GRID */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {products.filter(Boolean).map((p: any) => {
            const cartItem = cart.find((c) => c._id === p._id);
            const isMaxed =
              cartItem && cartItem.quantity >= p.quantity;

            return (
              <div
                key={p._id}
                className="border border-black/10 rounded-xl p-4 bg-white"
              >
                <div className="h-40 flex items-center justify-center bg-gray-100 rounded mb-2">
                  <img
                    src={
                      p?.image && !p.image.startsWith("blob:")
                        ? p.image
                        : "https://via.placeholder.com/150"
                    }
                    className="max-h-full object-contain"
                  />
                </div>

                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm">₹{p.price}</p>

                <p
                  className={`text-sm ${
                    p.quantity < 5
                      ? "text-red-600 font-semibold"
                      : ""
                  }`}
                >
                  Stock: {p.quantity}
                </p>

                <button
                  onClick={() => addToCart(p)}
                  disabled={p.quantity === 0 || isMaxed}
                  className="mt-3 w-full px-3 py-2 border rounded hover:bg-black hover:text-white disabled:bg-gray-200"
                >
                  {p.quantity === 0
                    ? "Out of stock"
                    : isMaxed
                    ? "Max reached"
                    : "Add to Cart"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* CART MODAL */}
      {showCart && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-xl p-5">
            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-lg">Cart</h3>
              <button onClick={() => setShowCart(false)}>✕</button>
            </div>

            {cart.length === 0 && <p>Cart is empty</p>}

            {cart.length > 0 && (
              <>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {cart.map((c) => (
                    <div
                      key={c._id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p>{c.name}</p>
                        <p className="text-sm text-gray-500">
                          ₹{c.price}
                        </p>
                      </div>

                      {/* CONTROLS */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decreaseQty(c)}
                          className="px-2 border rounded"
                        >
                          -
                        </button>

                        <span>{c.quantity}</span>

                        <button
                          onClick={() => increaseQty(c)}
                          className="px-2 border rounded"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(c._id)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between mt-4 font-semibold">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="mt-4 w-full bg-black text-white py-2 rounded"
                >
                  Checkout
                </button>
              </>
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
    <div>
      <h1 className="text-xl font-semibold mb-4">My Orders</h1>

      {orders.length === 0 && <p>No orders yet</p>}

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="border p-3 rounded">
            <p>Order ID: {o._id}</p>
            <p>Total: ₹{o.totalAmount}</p>
            <p>Status: {o.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}