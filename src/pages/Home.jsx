import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Utensils, Wine, ChefHat, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ambienceImages } from '../data/menuData';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemReveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Home() {
  const { isDark } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const bg = isDark ? 'bg-obsidian' : 'bg-light-bg';
  const bgAlt = isDark ? 'bg-obsidian-light' : 'bg-white';
  const textPrimary = isDark ? 'text-cream' : 'text-light-text';
  const textMuted = isDark ? 'text-muted' : 'text-light-muted';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % ambienceImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const experiences = [
    {
      icon: Utensils,
      title: 'The Dining Room',
      description: 'An intimate atelier where seasonal ingredients meet architectural plating.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', // Updated URL
      link: '/menu',
      colSpan: 'md:col-span-2 md:row-span-2'
    },
    {
      icon: Wine,
      title: 'Private Soirées',
      description: 'Exclusive spaces for unforgettable gatherings.',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop',
      link: '/events',
      colSpan: 'md:col-span-1 md:row-span-1'
    },
    {
      icon: ChefHat,
      title: "The Chef's Canvas",
      description: 'A counter-side front-row seat to culinary theatre.',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop',
      link: '/chefs-table',
      colSpan: 'md:col-span-1 md:row-span-1'
    },
  ];

  return (
    <main>
      {/* 1. Hero Section (Parallax & Glassmorphism) */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" id="hero">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop"
            alt="Fine dining"
            className="w-full h-full object-cover scale-105"
          />
          {/* Darker overlay for better contrast */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-obsidian/80" />
        </motion.div>

        <motion.div 
          className="relative z-10 w-full px-4 sm:px-6 flex justify-center items-center h-full"
          style={{ y: textY, opacity: textOpacity }}
        >
          <div className="max-w-4xl mx-auto relative overflow-hidden text-center w-full">
            <div className="relative flex flex-col items-center justify-center text-center w-full">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-gold text-sm sm:text-base tracking-[0.4em] uppercase mb-6 font-bold"
              >
                Established 2018 — Mumbai
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="font-serif text-4xl md:text-6xl lg:text-7xl text-ivory font-bold leading-tight mb-6 drop-shadow-lg"
              >
                Mongo<span className="gold-gradient-text">Meals</span>
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "circOut" }}
                className="w-24 h-1 bg-gold mx-auto mb-8 opacity-80 rounded-full"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-white text-base md:text-xl font-medium tracking-wide max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-md"
              >
                Where culinary artistry meets timeless elegance. An extraordinary dining experience 
                crafted for the most discerning palates.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-2xl mx-auto"
              >
                <Link to="/reservation" className="btn-base btn-primary w-full sm:w-auto shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  Reserve a Table
                </Link>
                <Link to="/menu" className="btn-base btn-primary w-full sm:w-auto shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  Explore the Menu
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-gold/40 flex justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-gold" />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Heritage Block (Asymmetric Layout) */}
      <section className={`${bgAlt} section-pad relative overflow-hidden`} id="heritage">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
        
        <div className="page-shell relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            {/* Text Content (Left) */}
            <motion.div 
              {...fadeUp}
              className="w-full lg:w-5/12 xl:w-1/3 lg:pr-8"
            >
              <h2 className="font-serif mb-8 leading-tight">
                <span className="text-gold text-xl md:text-2xl italic block mb-4">Welcome To</span>
                <span className={`${textPrimary} text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide`}>
                  Mongo<br/><span className="text-[#8c2222]">Meals</span>
                </span>
              </h2>
              
              <div className="w-12 h-[2px] bg-gold mb-8" />
              
              <div className={`space-y-6 ${textMuted} text-base md:text-lg leading-relaxed mb-10 font-light`}>
                <p>
                  At the heart of the city, MongoMeals serves exquisite multi-cuisine delicacies. 
                  Every dish is crafted with profound respect for authenticity, flavor, and technique.
                </p>
                <p>
                  Experience our masterfully curated recipes in a breathtaking ambiance. 
                  We don't just serve food; we craft unforgettable memories that linger long after the final course.
                </p>
              </div>

              <Link 
                to="/menu" 
                className="group inline-flex items-center gap-4 text-gold tracking-widest uppercase text-sm font-semibold hover:text-gold-light transition-colors"
              >
                Discover our story 
                <span className="w-10 h-[1px] bg-gold group-hover:w-16 transition-all duration-300" />
              </Link>
            </motion.div>

            {/* Asymmetric Image Grid (Right) */}
            <div className="w-full lg:w-7/12 xl:w-2/3 relative h-[600px] sm:h-[700px]">
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 right-0 w-3/4 h-[80%] rounded-xl overflow-hidden shadow-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=1000&fit=crop"
                  alt="Fine dining interior"
                  className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 w-1/2 h-[55%] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-gold/20 z-10"
              >
                <img
                  src="https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=600&fit=crop"
                  alt="Chef plating"
                  className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curated Experiences (Bento Grid) */}
      <section className={`${bg} section-pad relative`} id="experiences">
        <div className="page-shell relative z-10">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-gold text-sm tracking-[0.25em] uppercase mb-4 font-semibold">Curated Experiences</p>
              <h2 className={`font-serif text-3xl md:text-4xl lg:text-5xl ${textPrimary}`}>
                Ways to <span className="text-gold italic">Indulge</span>
              </h2>
            </div>
            <Link to="/menu" className="btn-ghost hidden md:flex shrink-0">
              View Full Offerings
            </Link>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 lg:gap-6 min-h-[600px] lg:min-h-[700px]"
          >
            {experiences.map((exp) => (
              <motion.div
                key={exp.title}
                variants={itemReveal}
                className={`relative group rounded-2xl overflow-hidden ${exp.colSpan}`}
              >
                <Link to={exp.link} className="block w-full h-full relative cursor-pointer">
                  {/* Background Image with Ken Burns hover effect */}
                  <div className="absolute inset-0 bg-obsidian">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-[1.5s] ease-out group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-500 mix-blend-overlay" />
                  
                  {/* Content Container */}
                  <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="bg-gold/20 w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md mb-6 border border-gold/30 text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-obsidian transition-all duration-300">
                      <exp.icon size={24} />
                    </div>
                    
                    <h3 className={`font-serif text-2xl md:text-3xl lg:text-4xl text-ivory mb-3 font-medium`}>
                      {exp.title}
                    </h3>
                    
                    <div className="overflow-hidden">
                      <p className="text-cream/80 text-sm md:text-base leading-relaxed max-w-sm opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 ease-out">
                        {exp.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-3 text-gold text-xs tracking-widest uppercase font-semibold opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-200">
                      Explore <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-8 md:hidden text-center">
            <Link to="/menu" className="btn-ghost w-full">
              View Full Offerings
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Live Ambience Showroom */}
      <section className={`${bgAlt} section-pad`} id="ambience">
        <div className="page-shell">
          <div className="relative h-[60vh] min-h-[500px] max-h-[700px] overflow-hidden bg-obsidian flex items-center justify-center rounded-3xl shadow-2xl border border-gold/10">
            {ambienceImages.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: index === currentSlide ? 1 : 0,
                  scale: index === currentSlide ? 1.05 : 1
                }}
                transition={{ 
                  opacity: { duration: 1.2, ease: "easeInOut" },
                  scale: { duration: 8, ease: "linear" }
                }}
                className="absolute inset-0"
                style={{ zIndex: index === currentSlide ? 1 : 0 }}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
                {/* Rich cinematic vignette */}
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
              </motion.div>
            ))}

            <div className="relative z-10 w-full h-full flex flex-col justify-end p-8 sm:p-12 md:p-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="max-w-2xl"
                >
                  <p className="text-gold text-sm tracking-[0.25em] uppercase mb-4 font-semibold">The Ambience</p>
                  <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ivory mb-4 leading-tight">
                    {ambienceImages[currentSlide].title}
                  </h3>
                  <p className="text-cream/70 text-base md:text-lg font-light">
                    {ambienceImages[currentSlide].subtitle}
                  </p>
                </motion.div>

                {/* Glass Controls */}
                <div className="flex items-center gap-4 shrink-0">
                  <button
                    onClick={() => setCurrentSlide(prev => (prev - 1 + ambienceImages.length) % ambienceImages.length)}
                    className="w-14 h-14 rounded-full glass flex items-center justify-center text-ivory hover:text-gold hover:border-gold transition-all duration-300 cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} />
                  </button>
                  
                  <div className="flex gap-2 mx-2">
                    {ambienceImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                          index === currentSlide ? 'w-8 bg-gold' : 'w-2 bg-cream/30 hover:bg-cream/60'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentSlide(prev => (prev + 1) % ambienceImages.length)}
                    className="w-14 h-14 rounded-full glass flex items-center justify-center text-ivory hover:text-gold hover:border-gold transition-all duration-300 cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={24} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}


