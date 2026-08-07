import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CalendarDays, Phone, User, CheckCircle2, X, QrCode } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { tables as tableData } from '../data/menuData';
import { apiFetch } from '../services/api';

export default function Reservation() {
  const { isDark } = useTheme();
  const [tablesState, setTablesState] = useState(tableData || []);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '19:00', guests: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

  const isTimeValid = (timeStr) => {
    if (!timeStr) return false;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const minMinutes = 11 * 60; // 11:00
    const maxMinutes = 23 * 60; // 23:00
    return totalMinutes >= minMinutes && totalMinutes <= maxMinutes;
  };

  const isTimeSlotPast = (timeStr) => {
    if (!timeStr) return true;
    if (form.date !== todayStr) return false;
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const [hour, min] = timeStr.split(':').map(Number);
    if (hour < currentHour) return true;
    if (hour === currentHour && min <= currentMinute) return true;
    return false;
  };

  // Fetch occupied tables dynamically from database based on selected date/time with proper validation
  useEffect(() => {
    if (!form.date) return;

    // Helper to reset tables to available state
    const resetTables = () => {
      setTablesState((tableData || []).map(t => ({ ...t, status: 'available' })));
    };

    // 1. Validate date (must be today or future)
    if (form.date < todayStr) {
      setErrorMsg('Please select a valid future reservation date.');
      resetTables();
      setSelectedTable(null);
      return;
    }

    // 2. Validate time range (11:00 - 23:00)
    if (!form.time) {
      // No time selected yet; keep tables available and no error
      setErrorMsg('');
      resetTables();
      return;
    }
    if (!isTimeValid(form.time)) {
      setErrorMsg('Reservation time must be between 11:00 AM and 11:00 PM.');
      resetTables();
      return;
    }

    // 3. If booking for today, ensure the time slot is not in the past
    if (form.date === todayStr && isTimeSlotPast(form.time)) {
      setErrorMsg('Please select a valid future time slot for today.');
      resetTables();
      return;
    }

    // All validations passed
    setErrorMsg('');

    // Fetch occupied tables for the valid date & time
    apiFetch(`/reservations/occupied?date=${form.date}&time=${form.time}`)
      .then(occupiedIds => {
        const occupied = Array.isArray(occupiedIds) ? occupiedIds : [];
        setTablesState((tableData || []).map(table => (
          occupied.includes(table.id) ? { ...table, status: 'occupied' } : { ...table, status: 'available' }
        )));
        if (selectedTable && occupied.includes(selectedTable)) {
          setSelectedTable(null);
        }
      })
      .catch(err => {
        console.error('Error fetching occupied tables:', err);
        resetTables();
      });
  }, [form.date, form.time]);

  const bg = isDark ? 'bg-obsidian' : 'bg-light-bg';
  const bgAlt = isDark ? 'bg-obsidian-light' : 'bg-white';
  const textPrimary = isDark ? 'text-cream' : 'text-light-text';
  const textMuted = isDark ? 'text-muted' : 'text-light-muted';
  const cardBorder = isDark ? 'border-gold/10' : 'border-black/5';

  const handleTableClick = (table) => {
    if (table.status === 'occupied') return;
    setSelectedTable(table.id === selectedTable ? null : table.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTable) return;

    if (form.date < todayStr) {
      setErrorMsg('Please select a valid future reservation date.');
      alert('Please select a valid future reservation date.');
      return;
    }

    if (form.time && !isTimeValid(form.time)) {
      setErrorMsg('Reservation time must be between 11:00 AM and 11:00 PM.');
      alert('Reservation time must be between 11:00 AM and 11:00 PM.');
      return;
    }

    if (isTimeSlotPast(form.time)) {
      setErrorMsg('Please select a valid future time slot for today.');
      alert('Please select a valid future time slot for today.');
      return;
    }
    
    try {
      await apiFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          date: form.date,
          time: form.time,
          guests: Number(form.guests),
          table: selectedTable
        })
      });
      setShowSuccess(true);
      setTablesState(prev =>
        prev.map(t => t.id === selectedTable ? { ...t, status: 'occupied' } : t)
      );
    } catch (err) {
      console.error('Failed to create reservation:', err);
      alert(err.message || 'Failed to create reservation. Please try again.');
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    setSelectedTable(null);
    setForm({ name: '', phone: '', date: '', time: '19:00', guests: '' });
    setErrorMsg('');
  };

  return (
    <main className={`${bg} min-h-screen pb-20`}>
      {/* Parallax Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1920&h=800&fit=crop"
            alt="Restaurant seating"
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
            Reserve Your Experience
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-ivory font-bold mb-6">
            Table <span className="text-gold italic font-light">Reservation</span>
          </h1>
          <div className="gold-line-wide mx-auto" />
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="page-shell py-12 md:py-16">
        <div className="py-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Table Grid / Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className={`${bgAlt} rounded-3xl border border-gold/20 p-6 md:p-8 card-glow shadow-xl`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className={`font-serif text-2xl ${textPrimary}`}>Floor Plan</h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium tracking-wider uppercase">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border-2 border-gold" /> Available
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]" /> Selected
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-gray-600/50" /> Occupied
                    </span>
                  </div>
                </div>

                {/* Architectural Map */}
                <div className={`relative w-full min-h-[360px] sm:min-h-0 aspect-[4/5] sm:aspect-[16/10] rounded-2xl ${isDark ? 'bg-obsidian border-white/5' : 'bg-gray-50 border-black/5'} border overflow-hidden shadow-inner`} id="table-map">
                  {/* Grid pattern background */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }} />

                  {/* Labels */}
                  <div className="absolute top-4 left-6 text-gold/40 text-[10px] font-bold tracking-widest uppercase">Entrance</div>
                  <div className="absolute bottom-4 right-6 text-gold/40 text-[10px] font-bold tracking-widest uppercase">Kitchen →</div>
                  <div className="absolute top-4 right-6 text-gold/40 text-[10px] font-bold tracking-widest uppercase">Window Side</div>

                  {tablesState.map(table => {
                    const isSelected = selectedTable === table.id;
                    const isOccupied = table.status === 'occupied';

                    return (
                      <motion.button
                        key={table.id}
                        whileHover={!isOccupied ? { scale: 1.1 } : {}}
                        whileTap={!isOccupied ? { scale: 0.95 } : {}}
                        onClick={() => handleTableClick(table)}
                        className={`absolute flex flex-col items-center justify-center rounded-2xl transition-all duration-300 cursor-pointer
                          ${table.seats <= 2 ? 'w-14 h-14 md:w-16 md:h-16' : table.seats <= 4 ? 'w-16 h-16 md:w-20 md:h-20' : 'w-20 h-16 md:w-24 md:h-20'}
                          ${isOccupied
                            ? 'bg-gray-600/20 border border-gray-600/20 cursor-not-allowed backdrop-blur-sm'
                            : isSelected
                              ? 'bg-gold text-obsidian shadow-[0_0_20px_rgba(212,175,55,0.5)] border border-gold'
                              : isDark
                                ? 'bg-obsidian/50 border border-gold/30 hover:border-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] backdrop-blur-sm'
                                : 'bg-white/50 border border-gold/30 hover:border-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] backdrop-blur-sm'
                          }`}
                        style={{ left: `${table.x}%`, top: `${table.y}%`, transform: 'translate(-50%, -50%)' }}
                        disabled={isOccupied}
                        id={`table-${table.id}`}
                        aria-label={`Table ${table.id}, ${table.seats} seats, ${isOccupied ? 'occupied' : 'available'}`}
                      >
                        <span className={`text-sm font-bold ${isSelected ? 'text-obsidian' : isOccupied ? 'text-gray-500/50' : 'text-gold'}`}>
                          T{table.id}
                        </span>
                        <span className={`text-[10px] flex items-center gap-1 mt-0.5 ${isSelected ? 'text-obsidian/80' : isOccupied ? 'text-gray-500/50' : textMuted}`}>
                          <Users size={12} /> {table.seats}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className={`${bgAlt} rounded-3xl border border-gold/20 p-8 sm:p-10 card-glow shadow-xl`}>
                <h2 className={`font-serif text-3xl ${textPrimary} mb-2`}>Complete Your Booking</h2>
                <div className="gold-line mb-6" />
                <p className={`${textMuted} text-sm mb-8 leading-relaxed`}>
                  {selectedTable
                    ? `Excellent choice. Table ${selectedTable} is selected for up to ${tablesState.find(t => t.id === selectedTable)?.seats} guests.`
                    : 'Please select an available table from the floor plan to begin your reservation.'
                  }
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className={`text-[11px] font-bold ${textMuted} tracking-[0.2em] uppercase mb-2 block`}>Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Alexander Sterling"
                        className={`w-full bg-transparent border border-gold/20 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all ${isDark ? 'text-cream placeholder-white/20' : 'text-light-text placeholder-black/20'}`}
                        required
                        id="reservation-name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`text-[11px] font-bold ${textMuted} tracking-[0.2em] uppercase mb-2 block`}>Phone Number</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        className={`w-full bg-transparent border border-gold/20 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all ${isDark ? 'text-cream placeholder-white/20' : 'text-light-text placeholder-black/20'}`}
                        required
                        id="reservation-phone"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={`text-[11px] font-bold ${textMuted} tracking-[0.2em] uppercase mb-2 block`}>Date</label>
                      <div className="relative">
                        <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                        <input
                          type="date"
                          min={todayStr}
                          value={form.date}
                          onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))}
                          className={`w-full bg-transparent border border-gold/20 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all ${isDark ? 'text-cream placeholder-white/20' : 'text-light-text placeholder-black/20'}`}
                          required
                          id="reservation-date"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`text-[11px] font-bold ${textMuted} tracking-[0.2em] uppercase mb-2 block`}>Time</label>
                      <div className="relative">
                        <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                        <input
                          type="time"
                          value={form.time}
                          onChange={(e) => setForm(p => ({ ...p, time: e.target.value }))}
                          className={`w-full bg-transparent border border-gold/20 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all ${isDark ? 'text-cream [color-scheme:dark]' : 'text-light-text [color-scheme:light]'}`}
                          required
                          id="reservation-time"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`text-[11px] font-bold ${textMuted} tracking-[0.2em] uppercase mb-2 block`}>Guests</label>
                    <div className="relative">
                      <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={form.guests}
                        onChange={(e) => setForm(p => ({ ...p, guests: e.target.value }))}
                        placeholder="4"
                        className={`w-full bg-transparent border border-gold/20 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all ${isDark ? 'text-cream placeholder-white/20' : 'text-light-text placeholder-black/20'}`}
                        required
                        id="reservation-guests"
                      />
                    </div>
                  </div>

                  {/* Selected Table Display */}
                  <div className={`p-5 rounded-2xl border transition-all duration-500
                    ${selectedTable ? 'border-gold bg-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border-gold/10 bg-transparent'}`}>
                    <p className={`text-[10px] font-bold ${textMuted} tracking-[0.2em] uppercase mb-2`}>Selected Table</p>
                    <p className={`font-serif text-2xl ${selectedTable ? 'text-gold' : textMuted}`}>
                      {selectedTable ? `Table ${selectedTable}` : 'No table selected'}
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      form.name.trim() === '' ||
                      form.phone.trim() === '' ||
                      form.date === '' ||
                      form.date < todayStr ||
                      Number(form.guests) < 1 ||
                      selectedTable === null ||
                      !isTimeValid(form.time) ||
                      isTimeSlotPast(form.time)
                    }
                    className={`w-full flex items-center justify-center gap-2 rounded-full py-4.5 px-6 font-bold text-sm tracking-widest uppercase transition-all duration-300 mt-4
                      ${(form.name.trim() !== '' && form.phone.trim() !== '' && form.date !== '' && form.date >= todayStr && Number(form.guests) >= 1 && selectedTable !== null && isTimeValid(form.time) && !isTimeSlotPast(form.time))
                        ? 'bg-gold text-obsidian shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:bg-white hover:text-black'
                        : isDark
                          ? 'bg-white/5 text-cream/30 border border-white/5 cursor-not-allowed'
                          : 'bg-black/5 text-black/30 border border-black/5 cursor-not-allowed'
                      }`}
                    id="confirm-reservation-btn"
                  >
                    Confirm Reservation
                  </button>
                </form>
              </div>
            </motion.div>
        </div>
      </div>
    </section>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeSuccess} />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-gradient-to-b from-ivory to-cream rounded-lg p-8 md:p-10 max-w-md w-full shadow-2xl text-center"
              id="reservation-success-modal"
            >
              <button onClick={closeSuccess} className="absolute top-4 right-4 text-obsidian/40 hover:text-obsidian">
                <X size={20} />
              </button>

              <CheckCircle2 size={48} className="text-gold mx-auto mb-4" />
              <h2 className="font-serif text-3xl text-obsidian mb-2">Reservation Confirmed</h2>
              <div className="gold-line mx-auto mb-6" />

              <div className="bg-obsidian/5 rounded-lg p-6 mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian/60">Guest</span>
                  <span className="text-obsidian font-medium">{form.name || 'Guest'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian/60">Date</span>
                  <span className="text-obsidian font-medium">{form.date || 'TBD'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian/60">Table</span>
                  <span className="text-obsidian font-medium">Table {selectedTable}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian/60">Guests</span>
                  <span className="text-obsidian font-medium">{form.guests || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian/60">Confirmation</span>
                  <span className="text-gold font-medium">RES-{Date.now().toString(36).toUpperCase()}</span>
                </div>
              </div>

              {/* Mock QR Code */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-28 h-28 bg-obsidian rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="qr-pattern absolute inset-2 opacity-40" />
                  <QrCode size={40} className="text-gold relative z-10" />
                </div>
                <p className="text-obsidian/40 text-xs">Scan for digital confirmation</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}


