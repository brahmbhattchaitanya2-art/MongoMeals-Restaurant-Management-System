import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sun, Moon, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsDrawerOpen } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavLinks = () => {
    const baseLinks = [
      { to: '/', label: 'Home' },
      { to: '/menu', label: 'Menu' },
      { to: '/reservation', label: 'Reservation' },
      { to: '/rewards', label: 'Rewards' },
      { to: '/events', label: 'Events' },
      { to: '/faq', label: 'FAQ' },
    ];

    if (!isAuthenticated) {
      return [
        ...baseLinks,
        { to: '/auth', label: 'Sign In' }
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...baseLinks,
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/admin', label: 'Admin' },
        { label: 'Logout', action: logout }
      ];
    }

    return [
      ...baseLinks,
      { to: '/dashboard', label: 'Profile' },
      { label: 'Logout', action: logout }
    ];
  };

  const navThemeLight = !scrolled || isDark;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 border-b backdrop-blur-2xl ${
        isDark
          ? 'bg-obsidian border-white/5 shadow-sm shadow-black/40'
          : 'bg-white border-black/5 shadow-sm shadow-black/5'
      }`}
    >
      <nav className="page-shell flex items-center justify-between gap-4 min-h-[100px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" id="nav-logo">
          <span className="font-serif text-3xl sm:text-4xl font-bold tracking-wide">
            <span className="text-gold">Mongo</span>
            <span className={isDark ? 'text-cream' : 'text-light-text'}>Meals</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-3 xl:gap-8 min-w-0" id="nav-desktop-links">
          {getNavLinks().map((link, idx) => {
            if (link.action) {
              return (
                <button
                  key={`nav-link-${idx}`}
                  onClick={link.action}
                  className={`relative text-xs xl:text-sm font-bold tracking-wider xl:tracking-widest uppercase transition-colors duration-300 whitespace-nowrap cursor-pointer
                    ${isDark ? 'text-cream/70 hover:text-gold' : 'text-light-text/70 hover:text-gold'}`}
                >
                  {link.label}
                </button>
              );
            }
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-xs xl:text-sm font-bold tracking-wider xl:tracking-widest uppercase transition-colors duration-300 whitespace-nowrap
                  ${location.pathname === link.to
                    ? 'text-gold'
                    : isDark ? 'text-cream/70 hover:text-gold' : 'text-light-text/70 hover:text-gold'
                  }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gold rounded-t-full"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
            id="theme-toggle"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} className="text-gold" /> : <Moon size={18} className="text-gold" />}
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`relative p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
            id="cart-button"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} className={isDark ? 'text-cream' : 'text-light-text'} />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-obsidian text-xs font-bold rounded-full flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2"
            id="mobile-menu-toggle"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={22} className="text-gold" /> : <Menu size={22} className={isDark ? 'text-cream' : 'text-light-text'} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden overflow-hidden rounded-b-lg ${isDark ? 'glass' : 'glass-light'}`}
            id="mobile-menu"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {getNavLinks().map((link, idx) => {
                if (link.action) {
                  return (
                    <button
                      key={`mobile-link-${idx}`}
                      onClick={link.action}
                      className={`w-full text-left text-sm font-medium tracking-widest uppercase py-2 border-b transition-colors cursor-pointer ${
                        isDark ? 'text-cream/70 border-white/5 hover:text-gold' : 'text-light-text/70 border-black/5 hover:text-gold'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-medium tracking-widest uppercase py-2 border-b transition-colors
                      ${location.pathname === link.to
                        ? 'text-gold border-gold/30'
                        : isDark
                          ? 'text-cream/70 border-white/5 hover:text-gold'
                          : 'text-light-text/70 border-black/5 hover:text-gold'
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}



