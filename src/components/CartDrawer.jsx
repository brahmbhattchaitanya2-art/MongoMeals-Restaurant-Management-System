import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, Loader2, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { apiFetch } from "../services/api";

export default function CartDrawer() {
  const { items, incrementItem, decrementItem, removeItem, clearCart, subtotal, gst, serviceFee, grandTotal, isDrawerOpen, setIsDrawerOpen } = useCart();
  const { isDark } = useTheme();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const bg = isDark ? 'bg-obsidian-light' : 'bg-white';
  const textPrimary = isDark ? 'text-cream' : 'text-light-text';
  const textMuted = isDark ? 'text-muted' : 'text-light-muted';
  const cardBg = isDark ? 'bg-obsidian-lighter' : 'bg-gray-50';

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: items,
          subtotal,
          tax: gst,
          serviceFee,
          total: grandTotal,
          guestEmail: 'guest@example.com' // Should be collected if not logged in, but hardcoded for now or we could omit
        })
      });
      setProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowPayment(false);
        clearCart();
        setIsDrawerOpen(false);
      }, 2500);
    } catch (error) {
      console.error('Error placing order:', error);
      setProcessing(false);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setIsDrawerOpen(false); setShowPayment(false); }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed top-0 right-0 h-full w-full max-w-md ${bg} z-50 flex flex-col shadow-2xl rounded-l-[2rem] border-l ${isDark ? 'border-gold/20' : 'border-black/10'}`}
            id="cart-drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gold/10">
              <h2 className={`font-serif text-xl ${textPrimary}`}>Your Selection</h2>
              <button onClick={() => { setIsDrawerOpen(false); setShowPayment(false); }} className={`${textMuted} hover:text-gold transition-colors`}>
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-6 px-6 py-12">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative flex h-32 w-32 items-center justify-center rounded-full border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent shadow-[0_0_40px_rgba(212,175,55,0.15)]"
                  >
                    <ShoppingBag size={48} className="text-gold opacity-90" strokeWidth={1.5} />
                    <div className="absolute inset-0 rounded-full border border-gold/10 scale-[1.2]" />
                  </motion.div>
                  <div className="max-w-[240px]">
                    <h3 className={`font-serif text-2xl ${textPrimary} mb-3`}>Your Cart is Empty</h3>
                    <p className={`${textMuted} text-sm leading-relaxed mb-8`}>
                      Embark on a culinary journey. Discover our curated menu and add your exquisite favorites.
                    </p>
                    <Link to="/menu" className="btn-primary w-full shadow-gold/20 shadow-xl" onClick={() => setIsDrawerOpen(false)}>
                      Explore The Menu
                    </Link>
                  </div>
                </div>
              ) : (
                items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className={`${cardBg} rounded-lg p-4 flex gap-4`}
                  >
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className={`${textPrimary} font-medium text-sm truncate`}>{item.name}</h4>
                      <p className="text-gold text-sm mt-1">₹{item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => decrementItem(item.id)} className="w-7 h-7 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className={`${textPrimary} text-sm font-medium w-6 text-center`}>{item.quantity}</span>
                        <button onClick={() => incrementItem(item.id)} className="w-7 h-7 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors">
                          <Plus size={14} />
                        </button>
                        <button onClick={() => removeItem(item.id)} className="ml-auto text-red-400/60 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Bill Summary */}
            {items.length > 0 && (
              <div className="border-t border-gold/10 p-6 space-y-3">
                <div className={`flex justify-between text-sm ${textMuted}`}>
                  <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className={`flex justify-between text-sm ${textMuted}`}>
                  <span>GST (5%)</span><span>₹{gst.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between text-sm ${textMuted}`}>
                  <span>Service Fee</span><span>₹{serviceFee}</span>
                </div>
                <div className="gold-line-wide mx-auto my-2" />
                <div className={`flex justify-between font-serif text-lg ${textPrimary}`}>
                  <span>Grand Total</span><span className="text-gold">₹{grandTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setShowPayment(true)}
                  className="btn-gold w-full rounded-lg mt-4 text-center"
                  id="checkout-btn"
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </motion.div>

          {/* Payment Modal */}
          <AnimatePresence>
            {showPayment && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              >
                <div className="absolute inset-0 bg-black/70" onClick={() => !processing && setShowPayment(false)} />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className={`relative ${bg} rounded-lg p-8 w-full max-w-sm shadow-2xl border border-gold/10`}
                  id="payment-modal"
                >
                  {paymentSuccess ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex flex-col items-center py-8"
                    >
                      <CheckCircle2 size={64} className="text-green-400 mb-4" />
                      <h3 className={`font-serif text-2xl ${textPrimary} mb-2`}>Payment Successful</h3>
                      <p className={textMuted}>Your order has been confirmed</p>
                    </motion.div>
                  ) : (
                    <>
                      <h3 className={`font-serif text-xl ${textPrimary} mb-2`}>Complete Payment</h3>
                      <p className="text-gold text-2xl font-serif mb-6">₹{grandTotal.toFixed(2)}</p>

                      <div className="space-y-3 mb-6">
                        {[
                          { id: 'upi', label: 'UPI Payment', icon: Smartphone },
                          { id: 'card', label: 'Secure Card', icon: CreditCard },
                          { id: 'cash', label: 'Cash on Delivery', icon: Banknote },
                        ].map(method => (
                          <label
                            key={method.id}
                            className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all
                              ${paymentMethod === method.id
                                ? 'border-gold/50 bg-gold/5'
                                : `${isDark ? 'border-white/5' : 'border-black/5'} hover:border-gold/20`
                              }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={method.id}
                              checked={paymentMethod === method.id}
                              onChange={() => setPaymentMethod(method.id)}
                              className="hidden"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                              ${paymentMethod === method.id ? 'border-gold' : isDark ? 'border-white/20' : 'border-black/20'}`}>
                              {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                            </div>
                            <method.icon size={18} className="text-gold" />
                            <span className={`${textPrimary} text-sm font-medium`}>{method.label}</span>
                          </label>
                        ))}
                      </div>

                      <button
                        onClick={handlePayment}
                        disabled={processing}
                        className="btn-gold w-full rounded-lg flex items-center justify-center gap-2"
                        id="pay-now-btn"
                      >
                        {processing ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Pay Now'
                        )}
                      </button>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

