import React from 'react';
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  totalAmount: number;
  increaseQty: (item: any) => void;
  decreaseQty: (item: any) => void;
  removeItem: (id: string) => void;
  onCheckout: () => void;
}

export const ShoppingCartDrawer: React.FC<CartProps> = ({
  isOpen,
  onClose,
  cart,
  totalAmount,
  increaseQty,
  decreaseQty,
  removeItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-end z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-slate-900 dark:text-white" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Your Shopping Cart
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
              <ShoppingBag size={48} className="text-slate-300 dark:text-slate-700 mb-3" />
              <p className="font-medium">Your cart feels light!</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Add items from the store to fulfill an order.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
              {cart.map((c) => (
                <div key={c._id} className="flex gap-4 items-center pt-4 first:pt-0 group animate-in fade-in">
                  <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center p-1.5 flex-shrink-0 border border-slate-100 dark:border-slate-700">
                    <img
                      src={c.image && !c.image.startsWith("blob:") ? c.image : "https://via.placeholder.com/150"}
                      alt={c.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                      {c.name}
                    </p>
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
                      <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 min-w-[24px] text-center">
                        {c.quantity}
                      </span>
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

        {/* CART FOOTER */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Estimated Subtotal
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{totalAmount}
              </span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};