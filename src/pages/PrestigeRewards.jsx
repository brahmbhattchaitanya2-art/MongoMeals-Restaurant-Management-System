import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Crown, Star, Gift, Clock, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from "../services/api";

export default function PrestigeRewards() {
  const { isDark } = useTheme();
  const { user, isAuthenticated, fetchProfile } = useAuth();
  const navigate = useNavigate();

  const [rewards, setRewards] = useState([]);
  const [stats, setStats] = useState({ currentBalance: 0, totalEarned: 0, redeemed: 0, visits: 0, reservations: 0 });
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [hidePoints, setHidePoints] = useState(false);
  const [viewAllRewards, setViewAllRewards] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch available rewards from database
      const rewardsData = await apiFetch('/users/rewards');
      setRewards(rewardsData || []);

      if (isAuthenticated) {
        // Fetch user statistics from database
        const statsData = await apiFetch('/users/stats');
        setStats(statsData || { currentBalance: 0, totalEarned: 0, redeemed: 0, visits: 0, reservations: 0 });
        
        // Fetch user history from database
        const historyData = await apiFetch('/users/history');
        setHistory(historyData || []);
      }
    } catch (err) {
      console.error('Error loading rewards data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const handleWriteReview = () => {
    navigate('/faq');
  };

  const handleRedeem = async (reward) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (stats.currentBalance < reward.pointsCost) {
      setMessage({ type: 'error', text: 'Not enough reward points.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      setRedeemingId(reward._id);
      await apiFetch('/users/redeem', {
        method: 'POST',
        body: JSON.stringify({ rewardId: reward._id })
      });
      
      setMessage({ type: 'success', text: `Successfully redeemed ${reward.name}!` });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
      
      // Refresh user profile context and reload statistics/history
      fetchProfile();
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to redeem reward' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setRedeemingId(null);
    }
  };

  // Theme Constants (matching dark/luxury theme)
  const bg = "bg-[#0D0D0D]";
  const textGold = "text-[#D4AF37]";
  const textWhite = "text-[#F5F5F5]";
  const textGray = "text-[#AAAAAA]";

  return (
    <main className={`${bg} min-h-screen pt-24 pb-20 font-sans overflow-hidden`}>
      {/* 1. HEADER */}
      <header className="flex flex-col items-center justify-center pt-8 pb-8 px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-[#1A1A1A] border border-[#D4AF37]/40 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
        >
          <Crown className={`${textGold}`} size={32} strokeWidth={1.5} />
        </motion.div>
        <motion.h1 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`text-3xl md:text-4xl font-serif font-bold ${textWhite} tracking-wide text-center`}
        >
          MongoMeals <span className={`${textGold} italic font-light`}>Rewards</span>
        </motion.h1>
        <div className="w-16 h-[1px] bg-[#D4AF37] mt-3 opacity-40" />
      </header>

      {/* ALERT / MESSAGE DISPLAY */}
      {message.text && (
        <div className="max-w-md mx-auto px-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl text-center text-sm font-medium border flex items-center justify-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/25 text-green-400'
                : 'bg-red-500/10 border-red-500/25 text-red-400'
            }`}
          >
            <AlertCircle size={16} />
            {message.text}
          </motion.div>
        </div>
      )}

      {/* 2. BALANCE CARD */}
      <section className="max-w-md mx-auto px-4 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 shadow-[0_15px_35px_rgba(0,0,0,0.6)] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <p className={`text-xs uppercase tracking-widest ${textGray} mb-2 font-medium`}>
            Reward Points Balance
          </p>
          <h2 className={`text-5xl font-serif font-bold ${textWhite} mb-4 flex items-center justify-center gap-1`}>
            {isAuthenticated ? (
              hidePoints ? '••••' : stats.currentBalance
            ) : (
              '—'
            )}
            <span className={`text-xs uppercase tracking-wider ${textGold} font-sans ml-1`}>pts</span>
          </h2>

          <div className="flex justify-center gap-6 mt-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setHidePoints(!hidePoints)}
                  className={`text-xs uppercase tracking-widest ${textGold} hover:${textWhite} transition-colors border-b border-[#D4AF37]/30 pb-0.5`}
                >
                  {hidePoints ? 'Show Points' : 'Hide Points'}
                </button>
                <button
                  onClick={() => setShowHistory(true)}
                  className={`text-xs uppercase tracking-widest ${textGold} hover:${textWhite} transition-colors border-b border-[#D4AF37]/30 pb-0.5`}
                >
                  History
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-white font-semibold tracking-wider text-xs uppercase hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                Sign In to View
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* 3. REDEEM SECTION */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-serif font-semibold ${textWhite} tracking-wide`}>
            Redeem Rewards
          </h3>
          {rewards.length > 4 && (
            <button
              onClick={() => setViewAllRewards(!viewAllRewards)}
              className={`text-xs uppercase tracking-widest ${textGold} hover:underline transition-all`}
            >
              {viewAllRewards ? 'Show Less' : 'View More'}
            </button>
          )}
        </div>

        {loading ? (
          <div className={`text-center py-12 ${textGray} text-sm`}>Loading available rewards...</div>
        ) : rewards.length === 0 ? (
          <div className={`text-center py-12 ${textGray} text-sm`}>No rewards available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {(viewAllRewards ? rewards : rewards.slice(0, 4)).map((reward) => {
              const canRedeem = isAuthenticated && stats.currentBalance >= reward.pointsCost;
              return (
                <motion.div
                  key={reward._id}
                  layout
                  className="bg-[#1A1A1A] border border-white/5 hover:border-[#D4AF37]/20 transition-all rounded-2xl overflow-hidden group shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="h-36 overflow-hidden relative">
                      <img
                        src={reward.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop'}
                        alt={reward.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                        <span className={`${textGold} text-xs font-semibold font-serif`}>
                          {reward.pointsCost} pts
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className={`text-sm font-medium ${textWhite} mb-1`}>{reward.name}</h4>
                      <p className={`text-[11px] ${textGray} leading-relaxed`}>
                        {reward.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={redeemingId === reward._id}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                        canRedeem
                          ? 'bg-[#D4AF37] text-white hover:bg-opacity-95 shadow-[0_0_10px_rgba(212,175,55,0.2)] cursor-pointer'
                          : 'bg-white/5 text-[#AAAAAA] cursor-not-allowed hover:bg-white/10'
                      }`}
                    >
                      {redeemingId === reward._id ? 'Redeeming...' : 'Redeem'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. BANNER SECTION */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-r from-[#1A1A1A] to-[#252525] border border-white/10 rounded-2xl p-6 md:p-8 text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <Star className={`${textGold}`} size={80} />
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <Gift className={`${textGold}`} size={80} />
          </div>
          <h3 className={`text-xl md:text-2xl font-serif font-semibold ${textGold} mb-2`}>
            Earn Points Every Visit
          </h3>
          <p className={`text-xs md:text-sm ${textWhite} font-light max-w-xl mx-auto leading-relaxed`}>
            Reserve, Order, Review and Earn Rewards
          </p>
        </div>
      </section>

      {/* 4. HOW TO EARN POINTS SECTION */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <h3 className={`text-lg font-serif font-semibold ${textWhite} tracking-wide mb-6`}>
          How to Earn Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className={`text-sm font-medium ${textWhite}`}>Sign Up</h4>
                  <p className={`text-xs ${textGray}`}>Create a new account</p>
                </div>
                <span className={`text-sm font-serif font-bold ${textGold}`}>+50 pts</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <div>
                  <h4 className={`text-sm font-medium ${textWhite}`}>First Reservation</h4>
                  <p className={`text-xs ${textGray}`}>Book your first table</p>
                </div>
                <span className={`text-sm font-serif font-bold ${textGold}`}>+100 pts</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <div>
                  <h4 className={`text-sm font-medium ${textWhite}`}>Every Reservation</h4>
                  <p className={`text-xs ${textGray}`}>Return visits reservations</p>
                </div>
                <span className={`text-sm font-serif font-bold ${textGold}`}>+50 pts</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <div>
                  <h4 className={`text-sm font-medium ${textWhite}`}>Dining Spend</h4>
                  <p className={`text-xs ${textGray}`}>Every ₹10 spent on completed order</p>
                </div>
                <span className={`text-sm font-serif font-bold ${textGold}`}>+1 pt</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <div>
                  <h4 className={`text-sm font-medium ${textWhite}`}>Order Above ₹1000</h4>
                  <p className={`text-xs ${textGray}`}>Bonus points per qualifying order</p>
                </div>
                <span className={`text-sm font-serif font-bold ${textGold}`}>+100 pts</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <div>
                  <h4 className={`text-sm font-medium ${textWhite}`}>Order Above ₹2500</h4>
                  <p className={`text-xs ${textGray}`}>Bonus points per qualifying order</p>
                </div>
                <span className={`text-sm font-serif font-bold ${textGold}`}>+250 pts</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex-1 mr-4">
                  <h4 className={`text-sm font-medium ${textWhite}`}>Write Review</h4>
                  <p className={`text-xs ${textGray}`}>Share your gastronomic experience</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-serif font-bold ${textGold} whitespace-nowrap`}>+50 pts</span>
                  {isAuthenticated && (
                    <button
                      onClick={handleWriteReview}
                      className="px-4 py-1.5 bg-[#D4AF37] text-white rounded-full text-xs font-semibold hover:bg-opacity-95 transition-all shadow-[0_0_10px_rgba(212,175,55,0.2)] cursor-pointer"
                    >
                      Write Review
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {!isAuthenticated && (
              <p className={`text-center text-xs ${textGray} mt-6 border-t border-white/5 pt-6`}>
                <button onClick={() => navigate('/auth')} className={`text-[#D4AF37] hover:underline font-bold`}>Sign In</button> to perform review tasks.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 5. BOTTOM STATS */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <h3 className={`text-lg font-serif font-semibold ${textWhite} tracking-wide mb-6`}>
          Rewards Activity
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Earned', val: isAuthenticated ? stats.totalEarned : '0' },
            { label: 'Redeemed', val: isAuthenticated ? stats.redeemed : '0' },
            { label: 'Current Balance', val: isAuthenticated ? stats.currentBalance : '0' },
            { label: 'Visits', val: isAuthenticated ? stats.visits : '0' },
            { label: 'Reservations', val: isAuthenticated ? stats.reservations : '0' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 bg-[#1A1A1A] border border-white/5 rounded-2xl shadow-md hover:border-[#D4AF37]/20 transition-all flex flex-col justify-center min-h-[90px]"
            >
              <p className={`text-[10px] uppercase tracking-widest ${textGray} mb-1`}>
                {stat.label}
              </p>
              <p className={`text-2xl font-serif font-semibold ${textWhite}`}>
                {stat.val}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. REWARD HISTORY TABLE */}
      {isAuthenticated && (
        <section className="max-w-5xl mx-auto px-4 mb-12">
          <h3 className={`text-lg font-serif font-semibold ${textWhite} tracking-wide mb-6`}>
            Reward History
          </h3>
          <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold">
                    <th className="p-4">Date</th>
                    <th className="p-4">Action</th>
                    <th className="p-4 text-center">Points</th>
                    <th className="p-4 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const chronological = [...history].reverse();
                    let current = 0;
                    const computed = chronological.map(item => {
                      if (item.type === 'Earned') {
                        current += item.points;
                      } else {
                        current -= item.points;
                      }
                      return { ...item, runningBalance: current };
                    });
                    const descHistory = computed.reverse();

                    return descHistory.map((item, index) => (
                      <tr key={item._id || index} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className={`p-4 text-xs ${textGray}`}>
                          {new Date(item.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className={`p-4 text-sm font-medium ${textWhite}`}>{item.description}</td>
                        <td className="p-4 text-center">
                          <span className={`font-serif font-semibold text-sm ${item.type === 'Earned' ? 'text-green-400' : 'text-red-400'}`}>
                            {item.type === 'Earned' ? '+' : '-'}{item.points}
                          </span>
                        </td>
                        <td className={`p-4 text-right font-serif font-semibold text-sm ${textWhite}`}>
                          {item.runningBalance} pts
                        </td>
                      </tr>
                    ));
                  })()}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="4" className={`p-8 text-center text-sm ${textGray}`}>No points activity yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* HISTORY MODAL */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto relative shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h3 className={`text-xl font-serif ${textWhite} font-semibold flex items-center gap-2`}>
                  <Clock size={20} className={`${textGold}`} /> Points History
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className={`text-xs uppercase tracking-widest ${textGray} hover:text-white transition-colors cursor-pointer`}
                >
                  Close
                </button>
              </div>

              {history.length === 0 ? (
                <p className={`${textGray} text-sm text-center py-8`}>No points activity yet.</p>
              ) : (
                <div className="space-y-4">
                  {history.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="bg-[#0D0D0D]/40 p-4 border border-white/5 rounded-xl flex justify-between items-center"
                    >
                      <div>
                        <p className={`text-sm font-medium ${textWhite}`}>{item.description}</p>
                        <p className={`text-[10px] ${textGray}`}>
                          {new Date(item.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-serif font-semibold text-base ${
                            item.type === 'Earned' ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {item.type === 'Earned' ? '+' : '-'}{item.points}
                        </span>
                        <p className={`text-[9px] uppercase tracking-widest ${textGray}`}>
                          {item.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
