import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AuthPage() {
  const { login, register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const bg = isDark ? 'bg-obsidian' : 'bg-light-bg';
  const bgAlt = isDark ? 'bg-obsidian-light' : 'bg-white';
  const textPrimary = isDark ? 'text-cream' : 'text-light-text';
  const textMuted = isDark ? 'text-muted' : 'text-light-muted';
  const cardBorder = isDark ? 'border-gold/10' : 'border-black/5';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await register(form);
      } else {
        await login(form);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden pb-12 pt-28">
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1920&h=1080&fit=crop"
          alt="Fine dining atmosphere"
          className="w-full h-full object-cover scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-${isDark ? 'obsidian/90' : 'white/95'} backdrop-blur-[2px]`} />
      </div>

      <section className="page-shell relative z-10 w-full">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-gold text-sm tracking-[0.4em] uppercase mb-4 font-semibold">Member Access</p>
            <h1 className={`font-serif text-5xl md:text-6xl ${isDark ? 'text-ivory' : 'text-light-text'} mb-6 font-bold leading-tight`}>
              Welcome to <span className="text-gold italic font-light">MongoMeals</span>
            </h1>
            <div className="w-16 h-[2px] bg-gold mb-8" />
            <p className={`${isDark ? 'text-cream/80' : 'text-light-text/80'} text-lg leading-relaxed max-w-md font-light`}>
              Sign in to track your reservations, save your curated menus, and enjoy a truly personalized culinary journey.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className={`${isDark ? 'glass' : 'glass-light'} rounded-2xl border border-gold/20 p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden`}>
              {/* Subtle glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex gap-3 mb-8 relative z-10">
                <button type="button" onClick={() => setMode('login')} className={`flex-1 rounded-full px-4 py-2.5 text-xs tracking-wider uppercase font-medium transition-all ${mode === 'login' ? 'bg-gold text-obsidian shadow-lg shadow-gold/20' : `${isDark ? 'text-cream/70' : 'text-light-text/70'} border border-gold/20 hover:border-gold/50`}`}>
                  Sign In
                </button>
                <button type="button" onClick={() => setMode('register')} className={`flex-1 rounded-full px-4 py-2.5 text-xs tracking-wider uppercase font-medium transition-all ${mode === 'register' ? 'bg-gold text-obsidian shadow-lg shadow-gold/20' : `${isDark ? 'text-cream/70' : 'text-light-text/70'} border border-gold/20 hover:border-gold/50`}`}>
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'register' && (
                  <div>
                    <label className={`text-xs ${textMuted} tracking-wider uppercase mb-1 block`}>Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-0 top-3.5 text-gold" />
                      <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Aarav Patel" className={`w-full bg-transparent border-b border-gold/20 pl-6 py-3 outline-none ${textPrimary}`} required={mode === 'register'} />
                    </div>
                  </div>
                )}

                <div>
                  <label className={`text-xs ${textMuted} tracking-wider uppercase mb-1 block`}>Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-0 top-3.5 text-gold" />
                    <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" className={`w-full bg-transparent border-b border-gold/20 pl-6 py-3 outline-none ${textPrimary}`} required />
                  </div>
                </div>

                <div>
                  <label className={`text-xs ${textMuted} tracking-wider uppercase mb-1 block`}>Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-0 top-3.5 text-gold" />
                    <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" className={`w-full bg-transparent border-b border-gold/20 pl-6 py-3 outline-none ${textPrimary}`} required />
                  </div>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button type="submit" disabled={loading} className="btn-gold w-full rounded-full">
                  {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
