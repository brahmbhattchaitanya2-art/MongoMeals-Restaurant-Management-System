import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

const faqs = [
  {
    question: 'How do I make a reservation?',
    answer:
      'You can reserve a table directly from the Reservation page, select your preferred table, and confirm your booking in a few simple steps.',
  },
  {
    question: 'Do you offer vegetarian and non-vegetarian options?',
    answer:
      'Yes. Our menu includes curated vegetarian, non-vegetarian, desserts, and beverage selections designed for every preference.',
  },
  {
    question: 'Can I place an order for pickup or delivery?',
    answer:
      'Absolutely. Use the cart and order flow on the menu to place an order, and our team will prepare it for pickup or delivery based on availability.',
  },
  {
    question: 'Is there a reward program for returning guests?',
    answer:
      'Yes. Every order earns reward points that can later be redeemed for exclusive offers and dining benefits.',
  },
  {
    question: 'Can I share feedback after my visit?',
    answer:
      'We welcome your feedback. Guests can submit ratings and comments to help us improve every dining experience.',
  },
  {
    question: 'Is the restaurant suitable for private events?',
    answer:
      'Yes. We host intimate gatherings, celebrations, and corporate dinners with tailored setups and dedicated event support.',
  },
];

export default function FAQPage() {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [openIndex, setOpenIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (!comment.trim()) {
      setErrorMsg('Please enter a review message.');
      return;
    }
    
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await apiFetch('/reviews', {
        method: 'POST',
        body: JSON.stringify({ rating, message: comment })
      });
      setSuccessMsg('Review submitted successfully! It is pending approval by the Admin.');
      setComment('');
      setRating(5);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const bg = isDark ? 'bg-obsidian' : 'bg-light-bg';
  const bgAlt = isDark ? 'bg-obsidian-light' : 'bg-white';
  const textPrimary = isDark ? 'text-cream' : 'text-light-text';
  const textMuted = isDark ? 'text-muted' : 'text-light-muted';
  const cardBorder = isDark ? 'border-gold/10' : 'border-black/5';

  return (
    <main className={`${bg} min-h-screen pb-20`}>
      {/* Parallax Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&h=800&fit=crop"
            alt="Fine dining details"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-${isDark ? 'obsidian' : 'white'} opacity-90`} />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-4 mt-16"
        >
          <p className="text-gold text-xs sm:text-sm tracking-[0.4em] uppercase mb-4 font-semibold">
            Guest Support
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-ivory font-bold mb-6">
            Frequently Asked <span className="text-gold italic font-light">Questions</span>
          </h1>
          <div className="gold-line-wide mx-auto" />
        </motion.div>
      </section>

      <section className="page-shell pb-24 md:pb-32">
        <div className={`${bgAlt} rounded-2xl border ${cardBorder} overflow-hidden shadow-2xl`}>
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <div key={item.question} className={`rounded-xl border ${cardBorder} overflow-hidden`}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className={`font-medium ${textPrimary}`}>{item.question}</span>
                      <ChevronDown
                        size={18}
                        className={`text-gold transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className={`px-5 pb-5 ${textMuted} leading-relaxed`}>{item.answer}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Review Form Section */}
      <section className="page-shell pb-24 max-w-3xl mx-auto px-4" id="reviews">
        <div className={`${bgAlt} rounded-2xl border ${cardBorder} p-6 sm:p-8 lg:p-10 shadow-2xl`}>
          <h2 className="font-serif text-2xl text-gold font-bold mb-2">Leave your Feedback</h2>
          <p className={`${textMuted} text-xs uppercase tracking-wider mb-6`}>We value your gastronomic reviews</p>
          
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="space-y-5">
              <div>
                <label className={`text-[11px] font-bold ${textMuted} tracking-[0.2em] uppercase mb-2 block`}>Your Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className={`w-full bg-white/5 border border-gold/10 rounded-xl py-3 px-4 text-sm outline-none text-white/50 cursor-not-allowed`}
                />
              </div>

              <div>
                <label className={`text-[11px] font-bold ${textMuted} tracking-[0.2em] uppercase mb-2 block`}>Rating</label>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        size={28}
                        className={star <= rating ? 'fill-gold text-gold' : 'text-white/20'}
                        strokeWidth={star <= rating ? 0 : 1.5}
                      />
                    </button>
                  ))}
                  <span className={`text-xs ${textMuted} ml-2 font-medium`}>{rating} of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className={`text-[11px] font-bold ${textMuted} tracking-[0.2em] uppercase mb-2 block`}>Review Message</label>
                <textarea
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your experience..."
                  className={`w-full bg-transparent border border-gold/20 rounded-xl py-3 px-4 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all ${isDark ? 'text-cream placeholder-white/20' : 'text-light-text placeholder-black/20'}`}
                  required
                />
              </div>

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold !rounded-full !py-3 !px-6 text-xs uppercase font-bold tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 bg-white/5 rounded-xl border border-white/5">
              <p className={`text-sm ${textMuted} mb-4`}>You must be signed in to submit a review.</p>
              <button
                onClick={() => navigate('/auth')}
                className="btn-gold inline-block !rounded-full !py-2.5 !px-6 text-xs uppercase font-bold tracking-widest cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
