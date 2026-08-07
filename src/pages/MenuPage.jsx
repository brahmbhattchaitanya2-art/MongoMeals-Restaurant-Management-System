import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, Eye, Search, SlidersHorizontal, Clock, Star, ChefHat, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

const filterChips = [
  'All', 'Starters', 'Main Course', 'Biryani', 'South Indian', 'Desserts', 'Beverages'
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recommended');
  const [priceFilter, setPriceFilter] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { addItem, setIsDrawerOpen } = useCart();
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [addedId, setAddedId] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    apiFetch('/menu')
      .then(data => setMenuItems(data))
      .catch(err => console.error('Error fetching menu items:', err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(id)) newFavs.delete(id);
      else newFavs.add(id);
      return newFavs;
    });
  };

  const handleAdd = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    addItem(item);
    setAddedId(item.id);
    setIsDrawerOpen(true);
    setTimeout(() => setAddedId(null), 800);
  };

  const filtered = menuItems.filter(item => {
    let catMatch = true;
    const cat = activeCategory;
    
    if (cat !== 'All' && item.category !== cat) {
      catMatch = false;
    }

    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let priceMatch = true;
    if (priceFilter === 'low') priceMatch = item.price < 1000;
    else if (priceFilter === 'medium') priceMatch = item.price >= 1000 && item.price <= 2500;
    else if (priceFilter === 'high') priceMatch = item.price > 2500;

    return catMatch && searchMatch && priceMatch;
  }).sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
    return 0;
  });

  const bg = isDark ? 'bg-[#0a0a0a]' : 'bg-[#fcfbf9]';
  const textPrimary = isDark ? 'text-[#f5f5f0]' : 'text-[#1a1a1a]';
  const textMuted = isDark ? 'text-[#9ca3af]' : 'text-[#6b7280]';

  return (
    <main className={`${bg} min-h-screen pb-[120px] font-sans selection:bg-[#d4af37] selection:text-black`}>
      
      {/* 1. MENU HERO */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop"
            alt="Michelin-star fine dining atmosphere"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#0a0a0a] opacity-95" />
        </motion.div>
        
        <div className="relative z-10 text-center px-4 mt-20 flex flex-col items-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[#d4af37] text-[14px] tracking-[0.4em] uppercase mb-6 font-semibold"
          >
            A Culinary Journey
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif text-[60px] md:text-[80px] text-[#f5f5f0] font-bold leading-tight mb-8"
          >
            The <span className="text-[#d4af37] italic font-light">Tasting</span> Menu
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-24 h-0.5 bg-[#d4af37] mx-auto mb-12" 
          />
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-[11px] tracking-[0.2em] uppercase">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>

        {/* Floating Reservation Button */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute right-10 bottom-10 hidden lg:block z-20"
        >
          <Link to="/reservation" className="flex items-center gap-3 bg-[#d4af37]/10 backdrop-blur-md border border-[#d4af37]/30 text-[#d4af37] px-6 py-3 rounded-full uppercase tracking-widest text-[13px] font-bold hover:bg-[#d4af37] hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            Reserve a Table
          </Link>
        </motion.div>
      </section>

      {/* 2. FILTER BAR */}
      <div className={`sticky top-[80px] z-40 transition-all duration-300 ${isScrolled ? `${isDark ? 'bg-[#0a0a0a]/90' : 'bg-white/90'} backdrop-blur-xl border-b ${isDark ? 'border-white/5' : 'border-black/5'} shadow-lg py-4` : 'bg-transparent py-8'}`} id="menu-filters">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-6">
            {/* Top Row: Search & Utilities */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-[350px]">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]" />
                <input 
                  type="text" 
                  placeholder="Search the menu..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-transparent border ${isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'} rounded-full py-3 pl-12 pr-6 text-[14px] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all outline-none`}
                />
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative group">
                  <select 
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className={`appearance-none rounded-full py-3 pl-5 pr-10 text-[14px] outline-none cursor-pointer border-[#d4af37] transition-all ${isDark ? 'bg-neutral-950 text-white border' : 'bg-white text-black border'}`}
                  >
                    <option value="all" className={isDark ? 'bg-neutral-950 text-white' : 'bg-white text-black'}>All Prices</option>
                    <option value="low" className={isDark ? 'bg-neutral-950 text-white' : 'bg-white text-black'}>Under Rs 1,000</option>
                    <option value="medium" className={isDark ? 'bg-neutral-950 text-white' : 'bg-white text-black'}>Rs 1,000 - 2,500</option>
                    <option value="high" className={isDark ? 'bg-neutral-950 text-white' : 'bg-white text-black'}>Above Rs 2,500</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37]" />
                </div>
                
                <div className="relative group">
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className={`appearance-none rounded-full py-3 pl-5 pr-10 text-[14px] outline-none cursor-pointer border-[#d4af37] transition-all ${isDark ? 'bg-neutral-950 text-white border' : 'bg-white text-black border'}`}
                  >
                    <option value="recommended" className={isDark ? 'bg-neutral-950 text-white' : 'bg-white text-black'}>Recommended</option>
                    <option value="price-asc" className={isDark ? 'bg-neutral-950 text-white' : 'bg-white text-black'}>Price: Low to High</option>
                    <option value="price-desc" className={isDark ? 'bg-neutral-950 text-white' : 'bg-white text-black'}>Price: High to Low</option>
                    <option value="name-asc" className={isDark ? 'bg-neutral-950 text-white' : 'bg-white text-black'}>Name: A to Z</option>
                  </select>
                  <SlidersHorizontal size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37]" />
                </div>
              </div>
            </div>

            {/* Bottom Row: Category Chips */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {filterChips.map(chip => (
                <button
                  key={chip}
                  onClick={() => setActiveCategory(chip)}
                  className={`px-6 py-2.5 rounded-full text-[13px] tracking-widest uppercase font-bold transition-all duration-300 whitespace-nowrap border shrink-0
                    ${activeCategory === chip
                      ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                      : isDark
                        ? 'text-[#f5f5f0]/70 border-white/10 hover:border-[#d4af37]/50 hover:text-[#d4af37] bg-white/5'
                        : 'text-[#1a1a1a]/70 border-black/10 hover:border-[#d4af37]/50 hover:text-[#d4af37] bg-black/5'
                    }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. MENU CARDS GRID */}
      <section className="max-w-7xl mx-auto px-6 mt-[120px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + searchQuery + sortOption + priceFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[32px]"
          >
            {filtered.map((item, index) => {
              // Deterministic fake data for badges
              const isChefRec = item.id % 3 === 0;
              const isPopular = item.id % 2 === 0;
              const rating = (4.5 + (item.id % 5) * 0.1).toFixed(1);
              const prepTime = 15 + (item.id % 4) * 10;
              const isFav = favorites.has(item.id);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className={`group relative flex flex-col p-[24px] rounded-2xl border transition-all duration-500
                    ${isDark ? 'bg-[#121212] border-white/5 hover:border-[#d4af37]/30' : 'bg-white border-black/5 hover:border-[#d4af37]/30'}
                    shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2`}
                >
                  {/* Image Container with Badges */}
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-[20px] bg-black/5">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&fit=crop'}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&fit=crop';
                      }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border text-[13px] font-bold tracking-wider uppercase
                        ${item.type === 'veg' ? 'bg-green-500/20 text-green-300 border-green-500/30' : item.type === 'vegan' ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                        <div className={`w-2 h-2 rounded-full ${item.type === 'veg' ? 'bg-green-400' : item.type === 'vegan' ? 'bg-teal-400' : 'bg-red-400'}`} />
                        {item.type}
                      </div>
                      {isPopular && (
                        <div className="bg-[#d4af37]/90 text-black px-3 py-1.5 rounded-full text-[13px] font-bold tracking-wider uppercase shadow-lg">
                          Popular
                        </div>
                      )}
                    </div>

                    {/* Quick Actions (Reveal on Hover) */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                      <button 
                        onClick={(e) => toggleFavorite(e, item.id)}
                        className={`w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors
                          ${isFav ? 'text-red-500' : 'text-white hover:bg-white/20'}`}
                      >
                        <Heart size={18} fill={isFav ? "currentColor" : "none"} />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <Eye size={18} />
                      </button>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-end text-white/90">
                      <span className="flex items-center gap-1.5 text-[13px] font-medium">
                        <Star size={14} className="text-[#d4af37] fill-[#d4af37]" /> {rating}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    {isChefRec && (
                      <div className="flex items-center gap-1.5 text-[#d4af37] text-[13px] font-bold uppercase tracking-widest mb-3">
                        <ChefHat size={14} /> Chef's Recommendation
                      </div>
                    )}
                    
                    <h3 className={`font-serif text-[34px] ${textPrimary} leading-tight mb-3 group-hover:text-[#d4af37] transition-colors duration-300`}>
                      {item.name}
                    </h3>
                    
                    <p className={`${textMuted} text-[17px] leading-relaxed mb-6 flex-1 line-clamp-3 font-light`}>
                      {item.description}
                    </p>

                    <div className="mt-auto flex flex-col gap-[20px]">
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[#d4af37] font-serif text-[32px] font-medium tracking-wide">
                          Rs {item.price.toLocaleString()}
                        </span>
                        
                        <button
                          onClick={(e) => handleAdd(e, item)}
                          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[16px] font-bold tracking-widest uppercase transition-all duration-300
                            ${addedId === item.id
                              ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)] scale-95'
                              : 'bg-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:bg-white'
                            }`}
                        >
                          {addedId === item.id ? 'Added' : (
                            <>
                              <Plus size={18} strokeWidth={2.5} /> Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* 4. EMPTY STATE */}
        {filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 rounded-full border border-[#d4af37]/20 flex items-center justify-center mb-6 bg-[#d4af37]/5">
              <Search size={32} className="text-[#d4af37]" />
            </div>
            <h2 className={`font-serif text-[34px] ${textPrimary} mb-4`}>No culinary matches found</h2>
            <p className={`${textMuted} text-[17px] max-w-md mx-auto mb-8 font-light leading-relaxed`}>
              We couldn't find any dishes matching your exact refined taste. Please adjust your filters to explore our curated selection.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setPriceFilter('all');
              }}
              className="px-8 py-4 rounded-full border border-[#d4af37] text-[#d4af37] text-[16px] font-bold tracking-widest uppercase hover:bg-[#d4af37] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </section>
    </main>
  );
}
