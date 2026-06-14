import React from 'react';
import { X } from 'lucide-react';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  totalAmount: number;
  checkoutData: any;
  setCheckoutData: (data: any) => void;
  processingPayment: boolean;
  onPaymentSubmit: () => void;
}

export const CheckoutModal: React.FC<CheckoutProps> = ({
  isOpen,
  onClose,
  cart,
  totalAmount,
  checkoutData,
  setCheckoutData,
  processingPayment,
  onPaymentSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
      <div className="w-full max-w-4xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Checkout
            </h2>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              Complete your purchase securely
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY CONTENT */}
        <div className="grid md:grid-cols-2 gap-0 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          
          {/* LEFT: Information Form */}
          <div className="p-6 space-y-5 bg-white dark:bg-slate-900">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Full Name</label>
                <input
                  type="text"
                  value={checkoutData.fullName}
                  onChange={(e) => setCheckoutData({ ...checkoutData, fullName: e.target.value })}
                  className="w-full mt-1.5 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Phone</label>
                <input
                  type="text"
                  maxLength={10}
                  value={checkoutData.phone}
                  onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                  className="w-full mt-1.5 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Address</label>
                <textarea
                  value={checkoutData.address}
                  onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                  className="w-full mt-1.5 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Street address, apartment, suite"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">City</label>
                  <input
                    type="text"
                    value={checkoutData.city}
                    onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
                    className="w-full mt-1.5 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={checkoutData.pincode}
                    onChange={(e) => setCheckoutData({ ...checkoutData, pincode: e.target.value })}
                    className="w-full mt-1.5 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    placeholder="400001"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT SELECTION */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase mb-2.5 block">
                Payment Method
              </label>
              <div className="space-y-2">
                {[
                  { value: "card", label: "Credit / Debit Card" },
                  { value: "upi", label: "UPI (Unified Payments Interface)" },
                  { value: "wallet", label: "Digital Wallet" },
                ].map((method) => {
                  const isSelected = checkoutData.paymentMethod === method.value;
                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setCheckoutData({ ...checkoutData, paymentMethod: method.value })}
                      className={`w-full border rounded-xl px-4 py-3.5 text-left transition-all duration-200 flex items-center justify-between font-medium text-sm active:scale-[0.99] ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-400 ring-1 ring-indigo-600"
                          : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <span>{method.label}</span>
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300 dark:border-slate-600"}`}>
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}

                {/* Conditional Dynamic Inputs */}
                {checkoutData.paymentMethod === "card" && (
                  <div className="space-y-3 mt-3 border border-indigo-100 dark:border-indigo-950/40 bg-indigo-50/20 dark:bg-indigo-950/5 rounded-xl p-4 animate-fadeIn">
                    <input
                      type="text"
                      placeholder="Card Number (16 Digits)"
                      maxLength={16}
                      value={checkoutData.cardNumber}
                      onChange={(e) => setCheckoutData({ ...checkoutData, cardNumber: e.target.value.replace(/\D/g, "") })}
                      className="w-full border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    />
                    <input
                      type="text"
                      placeholder="Card Holder Name"
                      value={checkoutData.cardName}
                      onChange={(e) => setCheckoutData({ ...checkoutData, cardName: e.target.value })}
                      className="w-full border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={checkoutData.expiry}
                        onChange={(e) => setCheckoutData({ ...checkoutData, expiry: e.target.value })}
                        className="w-full border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-center"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength={3}
                        value={checkoutData.cvv}
                        onChange={(e) => setCheckoutData({ ...checkoutData, cvv: e.target.value.replace(/\D/g, "") })}
                        className="w-full border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-center"
                      />
                    </div>
                  </div>
                )}

                {checkoutData.paymentMethod === "upi" && (
                  <div className="mt-3 border border-indigo-100 dark:border-indigo-950/40 bg-indigo-50/20 dark:bg-indigo-950/5 rounded-xl p-4 animate-fadeIn">
                    <input
                      type="text"
                      placeholder="vpa@upi (e.g., 9876543210@okaxis)"
                      value={checkoutData.upiId}
                      onChange={(e) => setCheckoutData({ ...checkoutData, upiId: e.target.value })}
                      className="w-full border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    />
                  </div>
                )}

                {checkoutData.paymentMethod === "wallet" && (
                  <div className="mt-3 border border-indigo-100 dark:border-indigo-950/40 bg-indigo-50/20 dark:bg-indigo-950/5 rounded-xl p-4 animate-fadeIn">
                    <input
                      type="text"
                      placeholder="Linked Mobile Number"
                      maxLength={10}
                      value={checkoutData.walletNumber}
                      onChange={(e) => setCheckoutData({ ...checkoutData, walletNumber: e.target.value.replace(/\D/g, "") })}
                      className="w-full border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Summary Sidebar */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900/40 flex flex-col h-full space-y-6">
            <div className="flex flex-col flex-grow min-h-0">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="h-14 w-14 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-700">
                      <img
                        src={item.image && !item.image.startsWith("blob:") ? item.image : "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Block */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5 bg-transparent mt-auto">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Amount</span>
                <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                onClick={onPaymentSubmit}
                disabled={processingPayment}
                className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold tracking-wide shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                {processingPayment ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  "Pay & Place Order"
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};