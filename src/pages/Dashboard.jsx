import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Receipt, CalendarDays, Edit, Trash2, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { dashboardOrders, dashboardReservations } from '../data/menuData';
import { apiFetch } from '../services/api';
import { useEffect } from 'react';

export default function Dashboard() {
  const { isDark } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      apiFetch('/reservations/my-reservations')
        .then(data => {
          const mapped = data.map(r => ({...r, id: r._id, time: r.time || '19:00'}));
          setReservations(mapped);
        })
        .catch(err => console.error(err));

      apiFetch('/orders/my-orders')
        .then(data => {
          const mappedOrders = data.map(o => ({
            id: o._id.substring(o._id.length - 8).toUpperCase(),
            date: new Date(o.createdAt).toLocaleDateString(),
            status: o.status,
            items: o.items.map(i => ({ name: i.name, qty: i.quantity, price: i.price })),
            subtotal: o.subtotal,
            tax: o.tax,
            serviceFee: o.serviceFee,
            total: o.total
          }));
          setOrders(mappedOrders);
        })
        .catch(err => console.error(err));
    } else {
      setReservations(dashboardReservations);
      setOrders(dashboardOrders);
    }
  }, [isAuthenticated]);

  const bg = isDark ? 'bg-obsidian' : 'bg-light-bg';
  const bgAlt = isDark ? 'bg-obsidian-light' : 'bg-white';
  const textPrimary = isDark ? 'text-cream' : 'text-light-text';
  const textMuted = isDark ? 'text-muted' : 'text-light-muted';
  const cardBg = isDark ? 'bg-obsidian-lighter' : 'bg-white';
  const cardBorder = isDark ? 'border-gold/10' : 'border-black/5';

  const cancelReservation = (id) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  return (
    <main className={`${bg} pt-28 md:pt-36 min-h-screen`}>
      {/* Header */}
      <section className="py-10 px-4 sm:px-6">
        <div className="page-shell-narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile Card */}
            <div className={`${bgAlt} rounded-lg border ${cardBorder} p-6 md:p-8 flex flex-col md:flex-row items-center gap-6`}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20">
                <User size={36} className="text-obsidian" />
              </div>
              <div className="text-center md:text-left">
                <h1 className={`font-serif text-2xl md:text-3xl ${textPrimary}`}>{isAuthenticated ? user?.name : 'Guest Profile'}</h1>
                <p className={`${textMuted} text-sm mt-1`}>{isAuthenticated ? user?.email : 'Sign in to access your account'} • Gold Tier</p>
                <p className="text-gold text-xs tracking-wider uppercase mt-2">
                  {orders.length} orders • {reservations.length} upcoming reservations
                </p>
              </div>
              {isAuthenticated && (
                <button onClick={logout} className="btn-ghost !py-2.5 !px-5 rounded-full text-xs">
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="page-shell-narrow pb-24">
        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium tracking-wider uppercase transition-all
              ${activeTab === 'orders'
                ? 'bg-gold text-obsidian'
                : isDark
                  ? 'text-cream/60 border border-white/10 hover:border-gold/30'
                  : 'text-light-text/60 border border-black/10 hover:border-gold/30'
              }`}
            id="tab-orders"
          >
            <Receipt size={16} /> Order History
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium tracking-wider uppercase transition-all
              ${activeTab === 'reservations'
                ? 'bg-gold text-obsidian'
                : isDark
                  ? 'text-cream/60 border border-white/10 hover:border-gold/30'
                  : 'text-light-text/60 border border-black/10 hover:border-gold/30'
              }`}
            id="tab-reservations"
          >
            <CalendarDays size={16} /> Upcoming Reservations
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'orders' ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {orders.map(order => {
                const orderSubtotal = order.subtotal || order.items.reduce((s, i) => s + i.price * i.qty, 0);
                const orderGst = order.tax || orderSubtotal * 0.05;
                const serviceFee = order.serviceFee || 49;
                const orderTotal = order.total || orderSubtotal + orderGst + serviceFee;
                const isExpanded = expandedOrder === order.id;

                return (
                  <div key={order.id} className={`${cardBg} rounded-lg border ${cardBorder} overflow-hidden`}>
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-hover transition-colors"
                      id={`order-${order.id}`}
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                          <Receipt size={18} className="text-gold" />
                        </div>
                        <div className="text-left">
                          <p className={`${textPrimary} font-medium`}>{order.id}</p>
                          <p className={`${textMuted} text-xs`}>{order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="text-right">
                          <p className="text-gold font-serif font-semibold">₹{orderTotal.toFixed(2)}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{order.status}</span>
                        </div>
                        <ChevronRight size={18} className={`${textMuted} transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className={`px-6 pb-6 pt-2 border-t ${cardBorder}`}>
                            <table className="w-full text-sm">
                              <thead>
                                <tr className={textMuted}>
                                  <th className="text-left py-2 font-normal text-xs tracking-wider uppercase">Item</th>
                                  <th className="text-center py-2 font-normal text-xs tracking-wider uppercase">Qty</th>
                                  <th className="text-right py-2 font-normal text-xs tracking-wider uppercase">Price</th>
                                  <th className="text-right py-2 font-normal text-xs tracking-wider uppercase">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, idx) => (
                                  <tr key={idx} className={`border-t ${cardBorder}`}>
                                    <td className={`py-3 ${textPrimary}`}>{item.name}</td>
                                    <td className={`py-3 text-center ${textMuted}`}>{item.qty}</td>
                                    <td className={`py-3 text-right ${textMuted}`}>₹{item.price.toLocaleString()}</td>
                                    <td className={`py-3 text-right ${textPrimary}`}>₹{(item.price * item.qty).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className={`mt-4 pt-4 border-t ${cardBorder} space-y-2`}>
                              <div className={`flex justify-between text-sm ${textMuted}`}>
                                <span>Subtotal</span><span>₹{orderSubtotal.toLocaleString()}</span>
                              </div>
                              <div className={`flex justify-between text-sm ${textMuted}`}>
                                <span>GST (5%)</span><span>₹{orderGst.toFixed(2)}</span>
                              </div>
                              <div className={`flex justify-between text-sm ${textMuted}`}>
                                <span>Service Fee</span><span>₹{serviceFee}</span>
                              </div>
                              <div className="gold-line-wide mx-auto my-2" />
                              <div className={`flex justify-between font-serif text-lg ${textPrimary}`}>
                                <span>Total</span><span className="text-gold">₹{orderTotal.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="reservations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
            >
              {reservations.map(res => (
                <motion.div
                  key={res.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`${cardBg} rounded-lg border ${cardBorder} p-6 card-glow`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs tracking-wider uppercase ${
                      res.status === 'Confirmed'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {res.status}
                    </span>
                    <span className={`${textMuted} text-xs`}>{res.id}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-gold" />
                      <span className={textPrimary}>{res.date} at {res.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gold" />
                      <span className={textMuted}>{res.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-sm border-2 border-gold flex items-center justify-center text-[8px] text-gold font-bold">T</span>
                      <span className={textMuted}>Table {res.table}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="flex-1 btn-ghost !py-2.5 !text-xs rounded-lg flex items-center justify-center gap-1.5" id={`modify-${res.id}`}>
                      <Edit size={13} /> Modify
                    </button>
                    <button
                      onClick={() => cancelReservation(res.id)}
                      className="flex-1 py-2.5 text-xs rounded-lg border border-red-400/20 text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center gap-1.5 tracking-wider uppercase font-medium"
                      id={`cancel-${res.id}`}
                    >
                      <Trash2 size={13} /> Cancel
                    </button>
                  </div>
                </motion.div>
              ))}

              {reservations.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <p className={textMuted}>No upcoming reservations</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}


