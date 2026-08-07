import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Heart, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        await apiFetch('/users/subscribe-newsletter', {
          method: 'POST',
          body: JSON.stringify({ email })
        });
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
      } catch (err) {
        console.error('Subscription error:', err);
      }
    }
  };

  const bg = isDark ? 'bg-obsidian-light' : 'bg-white';
  const border = isDark ? 'border-white/5' : 'border-black/5';
  const textMuted = isDark ? 'text-muted' : 'text-light-muted';
  const textPrimary = isDark ? 'text-cream' : 'text-light-text';

  return (
    <>
      {/* Compact Pre-Footer CTA */}
      <section className="relative min-h-[220px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&h=600&fit=crop"
            alt="Restaurant ambience"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-[1px]" />
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center w-full"
          >
            <p className="text-gold text-xs tracking-[0.25em] uppercase mb-3 font-semibold">An Unforgettable Evening Awaits</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4 leading-tight">
              Your Table Is Ready
            </h2>
            <Link to="/reservation" className="btn-base btn-primary !py-2.5 !px-6 rounded-full text-xs font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              Make a Reservation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Compact Main Footer */}
      <footer className={`${bg} border-t ${border} pt-12 pb-6`} id="footer">
        <div className="page-shell">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-8">
            {/* Column 1: Brand & Newsletter */}
            <div className="lg:col-span-5 pr-0 lg:pr-6">
              <Link to="/" className="inline-block mb-3">
                <span className="font-serif text-3xl font-bold tracking-tight text-gold">Mongo<span className={textPrimary}>Meals</span></span>
              </Link>
              <p className={`${textMuted} text-sm leading-relaxed mb-4 max-w-sm font-light`}>
                An extraordinary culinary destination where artistry meets gastronomy. 
                Every dish is a masterpiece, every moment an experience crafted for you.
              </p>
              
              {isAuthenticated ? (
                <div className="py-2">
                  <p className="text-gold text-sm font-medium italic">
                    Welcome back to MongoMeals.
                  </p>
                </div>
              ) : (
                <>
                  <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-3">Join Our Society</h4>
                  <form onSubmit={handleSubscribe} className="relative mb-3 max-w-sm">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className={`w-full bg-transparent border-0 border-b-2 ${border} ${textPrimary} placeholder-neutral-500 text-sm py-2 pr-12 focus:ring-0 focus:border-gold focus:outline-none transition-colors`}
                      id="newsletter-email"
                      required
                    />
                    <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-gold/60 hover:text-gold hover:scale-110 transition-all p-2" aria-label="Subscribe">
                      <ArrowRight size={18} />
                    </button>
                  </form>
                  {subscribed && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-gold text-xs uppercase tracking-wider font-semibold"
                    >
                      ✓ Welcome to the inner circle
                    </motion.p>
                  )}
                </>
              )}
            </div>

            {/* Column 2: Navigate */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-4">Experiences</h4>
              <ul className="space-y-2">
                {[
                  { to: '/menu', label: 'The Menu' },
                  { to: '/reservation', label: 'Reserve a Table' },
                  { to: '/events', label: 'Private Events' },
                  { to: '/rewards', label: 'Rewards' },
                  { to: '/faq', label: 'FAQs' },
                ].map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className={`${textMuted} text-sm font-light hover:text-gold hover:translate-x-1 inline-block transition-transform duration-300`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Visit Us */}
            <div className="lg:col-span-4">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-4">Visit Us</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4 group cursor-pointer">
                  <MapPin size={18} className="text-gold/60 group-hover:text-gold transition-colors shrink-0 mt-0.5" />
                  <p className={`${textMuted} text-sm font-light leading-relaxed group-hover:text-gold transition-colors`}>
                    <strong className={`block ${textPrimary} font-medium mb-0.5`}>Mumbai Flagship</strong>
                    42 Boulevard de la Gastronomie, Mumbai, MH 400001
                  </p>
                </div>
                <div className="flex items-start gap-4 group cursor-pointer">
                  <Clock size={18} className="text-gold/60 group-hover:text-gold transition-colors shrink-0 mt-0.5" />
                  <div className={`${textMuted} text-sm font-light leading-relaxed group-hover:text-gold transition-colors`}>
                    <p>Mon–Fri: 12:00 PM – 11:00 PM</p>
                    <p>Sat–Sun: 11:00 AM – 12:00 AM</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <a href="tel:+912267890123" className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-obsidian transition-all duration-300" aria-label="Call Us"><Phone size={16} /></a>
                  <a href="mailto:reservations@mongomeals.com" className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-obsidian transition-all duration-300" aria-label="Email Us"><Mail size={16} /></a>
                  <a href="#" className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-obsidian transition-all duration-300" aria-label="Instagram"><Heart size={16} /></a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-6 border-t ${border} flex flex-col md:flex-row justify-between items-center gap-4`}>
            <p className={`${textMuted} text-xs font-light`}>
              &copy; {new Date().getFullYear()} MongoMeals. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs font-light">
              <Link to="/" className={`${textMuted} hover:text-gold transition-colors`}>Privacy Policy</Link>
              <Link to="/" className={`${textMuted} hover:text-gold transition-colors`}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}


