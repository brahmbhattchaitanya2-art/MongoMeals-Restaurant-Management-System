import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Maximize2, Music, Send } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { apiFetch } from "../services/api";

const venues = [
  {
    id: 'pavilion',
    name: 'The Grand Pavilion',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=500&fit=crop',
    capacity: '150 Guests',
    area: '3,200 sq ft',
    description: 'Our flagship event space featuring soaring ceilings, crystal chandeliers, and a dedicated private bar. Ideal for weddings, galas, and corporate celebrations.',
    features: ['Private Bar', 'Dance Floor', 'AV System', 'Bridal Suite'],
  },
  {
    id: 'lounge',
    name: 'Executive Lounge',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=500&fit=crop',
    capacity: '40 Guests',
    area: '800 sq ft',
    description: 'An intimate setting with leather furnishings, ambient lighting, and curated art. Perfect for board dinners, product launches, and private tastings.',
    features: ['Presentation Screen', 'Wine Wall', 'Cigar Terrace', 'Private Chef'],
  },
  {
    id: 'terrace',
    name: 'The Starlight Terrace',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=500&fit=crop',
    capacity: '80 Guests',
    area: '1,800 sq ft',
    description: 'An open-air rooftop space with panoramic city views, string lights, and lush greenery. The ultimate setting for cocktail parties and sunset soirées.',
    features: ['City Views', 'Open Air', 'Live Music Stage', 'Cocktail Bar'],
  },
];

export default function Events() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('pavilion');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', guests: '', eventType: '', venue: '', dietary: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const bg = isDark ? 'bg-obsidian' : 'bg-light-bg';
  const bgAlt = isDark ? 'bg-obsidian-light' : 'bg-white';
  const textPrimary = isDark ? 'text-cream' : 'text-light-text';
  const textMuted = isDark ? 'text-muted' : 'text-light-muted';
  const cardBorder = isDark ? 'border-gold/10' : 'border-black/5';

  const activeVenue = venues.find(v => v.id === activeTab);

  const [errorMsg, setErrorMsg] = useState('');

  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitted(false);

    // 1. Check all required fields
    if (!form.name || !form.email || !form.phone || !form.date || !form.guests || !form.eventType || !form.venue) {
      setErrorMsg('All required fields must be filled.');
      return;
    }

    // 2. Phone validation
    const phoneRegex = /^[+]?[0-9\s\-()]{10,20}$/;
    if (!phoneRegex.test(form.phone)) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    // 3. Guests count validation
    if (Number(form.guests) <= 0) {
      setErrorMsg('Expected guests must be more than 0.');
      return;
    }

    // 4. Date validation
    const todayStr = getTodayString();
    if (form.date < todayStr) {
      setErrorMsg('Please select a valid future event date.');
      return;
    }

    try {
      await apiFetch('/events/request', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          date: form.date,
          guests: form.guests,
          eventType: form.eventType,
          venue: form.venue,
          dietary: form.dietary,
          message: form.message
        })
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setForm({ name: '', email: '', phone: '', date: '', guests: '', eventType: '', venue: '', dietary: '', message: '' });
    } catch (error) {
      console.error('Error submitting event request:', error);
      setErrorMsg(error.message || 'Failed to submit event request. Please try again.');
    }
  };

  return (
    <main className={`${bg} min-h-screen pb-20`}>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[460px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&h=800&fit=crop"
            alt="Grand events"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-${isDark ? 'obsidian' : 'white'} opacity-90`} />
        </div>
        <div className="relative z-10 text-center px-4 mt-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Music size={40} className="text-gold mx-auto mb-4 opacity-80" strokeWidth={1.5} />
            <p className="text-gold text-xs sm:text-sm tracking-[0.4em] uppercase mb-4 font-semibold">
              Host With Us
            </p>
            <h1 className="font-serif text-5xl md:text-7xl text-ivory font-bold mb-6">
              Private Events & <span className="text-gold italic font-light">Celebrations</span>
            </h1>
            <div className="gold-line-wide mx-auto mb-6" />
            <p className="text-cream/80 text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
              From grand galas to intimate gatherings — let us orchestrate an unforgettable occasion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Venue Tabs */}
      <section className={`${bgAlt} section-pad`} id="venues">
        <div className="page-shell">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gold text-sm tracking-[0.25em] uppercase mb-4">Our Venues</p>
            <h2 className={`font-serif text-3xl md:text-4xl ${textPrimary} mb-4`}>
              Spaces for Every <span className="text-gold italic">Occasion</span>
            </h2>
            <div className="gold-line-wide mx-auto" />
          </motion.div>

          {/* Tabs */}
          <div className="flex overflow-x-auto sm:flex-wrap sm:justify-center gap-3 mb-10 pb-1">
            {venues.map(venue => (
              <button
                key={venue.id}
                onClick={() => setActiveTab(venue.id)}
                className={`px-6 py-3 rounded-full text-xs tracking-wider uppercase font-medium transition-all
                  ${activeTab === venue.id
                    ? 'bg-gold text-obsidian'
                    : isDark
                      ? 'text-cream/60 border border-white/10 hover:border-gold/30 hover:text-gold'
                      : 'text-light-text/60 border border-black/10 hover:border-gold/30 hover:text-gold'
                  }`}
                id={`venue-tab-${venue.id}`}
              >
                {venue.name}
              </button>
            ))}
          </div>

          {/* Active Venue */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch"
          >
            <div className="rounded-lg overflow-hidden relative h-72 lg:h-auto lg:min-h-[400px]">
              <img
                src={activeVenue.image}
                alt={activeVenue.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className={`${isDark ? 'bg-obsidian-lighter' : 'bg-gray-50'} rounded-lg p-8 border ${cardBorder}`}>
              <h3 className={`font-serif text-2xl ${textPrimary} mb-4`}>{activeVenue.name}</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-gold" />
                  <div>
                    <p className={`${textMuted} text-xs tracking-wider uppercase`}>Capacity</p>
                    <p className={`${textPrimary} font-medium`}>{activeVenue.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize2 size={18} className="text-gold" />
                  <div>
                    <p className={`${textMuted} text-xs tracking-wider uppercase`}>Area</p>
                    <p className={`${textPrimary} font-medium`}>{activeVenue.area}</p>
                  </div>
                </div>
              </div>

              <p className={`${textMuted} leading-relaxed mb-6`}>{activeVenue.description}</p>

              <div className="flex flex-wrap gap-2">
                {activeVenue.features.map(f => (
                  <span key={f} className="px-3 py-1.5 rounded-full bg-gold/10 text-gold text-xs tracking-wider">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Request a Quote Form */}
      <section className={`${bg} section-pad`} id="quote-form">
        <div className="page-shell-narrow max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-gold text-sm tracking-[0.25em] uppercase mb-4">Get in Touch</p>
            <h2 className={`font-serif text-3xl ${textPrimary} mb-4`}>
              Request a <span className="text-gold italic">Quote</span>
            </h2>
            <div className="gold-line-wide mx-auto" />
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className={`${bgAlt} rounded-lg p-5 sm:p-8 border ${cardBorder} space-y-6`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              <div>
                <label className={`text-xs ${textMuted} tracking-wider uppercase mb-1 block`}>Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className={`input-luxury ${!isDark ? '!text-light-text !border-black/10 focus:!border-gold' : ''}`}
                  placeholder="Your name" required id="event-name" />
              </div>
              <div>
                <label className={`text-xs ${textMuted} tracking-wider uppercase mb-1 block`}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className={`input-luxury ${!isDark ? '!text-light-text !border-black/10 focus:!border-gold' : ''}`}
                  placeholder="you@email.com" required id="event-email" />
              </div>
              <div>
                <label className={`text-xs ${textMuted} tracking-wider uppercase mb-1 block`}>Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className={`input-luxury ${!isDark ? '!text-light-text !border-black/10 focus:!border-gold' : ''}`}
                  placeholder="+91 98765 43210" required id="event-phone" />
              </div>
              <div>
                <label className={`text-xs ${textMuted} tracking-wider uppercase mb-1 block`}>Event Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  min={getTodayString()}
                  className={`input-luxury ${!isDark ? '!text-light-text !border-black/10 focus:!border-gold' : ''}`}
                  required id="event-date" />
              </div>
              <div>
                <label className={`text-xs ${textMuted} tracking-wider uppercase mb-1 block`}>Expected Guests</label>
                <input type="number" value={form.guests} onChange={e => setForm(p => ({ ...p, guests: e.target.value }))}
                  min="1"
                  className={`input-luxury ${!isDark ? '!text-light-text !border-black/10 focus:!border-gold' : ''}`}
                  placeholder="50" required id="event-guests" />
              </div>
              <div>
                <label className={`text-xs ${textMuted} tracking-wider uppercase mb-1 block`}>Event Type</label>
                <select value={form.eventType} onChange={e => setForm(p => ({ ...p, eventType: e.target.value }))}
                  className={`input-luxury ${!isDark ? '!text-light-text !border-black/10 focus:!border-gold' : ''}`}
                  required id="event-type">
                  <option value="">Select type...</option>
                  <option value="wedding">Wedding Reception</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday / Anniversary</option>
                  <option value="cocktail">Cocktail Party</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className={`text-xs ${textMuted} tracking-wider uppercase mb-1 block`}>Preferred Venue</label>
              <select value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))}
                className={`input-luxury ${!isDark ? '!text-light-text !border-black/10 focus:!border-gold' : ''}`}
                required id="event-venue">
                <option value="">Select venue...</option>
                {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>

            <div>
              <label className={`text-xs ${textMuted} tracking-wider uppercase mb-1 block`}>Catering & Dietary Preferences</label>
              <textarea value={form.dietary} onChange={e => setForm(p => ({ ...p, dietary: e.target.value }))}
                rows={2} className={`input-luxury resize-none ${!isDark ? '!text-light-text !border-black/10 focus:!border-gold' : ''}`}
                placeholder="Vegetarian options, allergies, special requests..."
                id="event-dietary" />
            </div>

            <div>
              <label className={`text-xs ${textMuted} tracking-wider uppercase mb-1 block`}>Additional Message</label>
              <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                rows={3} className={`input-luxury resize-none ${!isDark ? '!text-light-text !border-black/10 focus:!border-gold' : ''}`}
                placeholder="Tell us about your vision..."
                id="event-message" />
            </div>

            <button type="submit" className="btn-gold w-full rounded-lg flex items-center justify-center gap-2" id="event-submit-btn">
              {submitted ? '✓ Request Sent' : (
                <>
                  <Send size={16} /> Submit Request
                </>
              )}
            </button>
            {errorMsg && (
              <p className="text-red-500 text-sm text-center font-medium mt-2">
                {errorMsg}
              </p>
            )}
            {submitted && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold text-sm text-center">
                Event request submitted successfully. Our team will contact you soon.
              </motion.p>
            )}
          </motion.form>
        </div>
      </section>
    </main>
  );
}



