import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiFetch } from '../services/api';

const AdminPage = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [eventRequests, setEventRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Menu Add Item Form state
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Starters',
    type: 'veg',
    price: '',
    description: '',
    isChefSpecial: false,
    availability: 'Available',
    imageFile: null
  });
  const [menuMessage, setMenuMessage] = useState('');

  // Rewards Add Item Form state
  const [newReward, setNewReward] = useState({
    name: '',
    pointsCost: '',
    description: '',
    isActive: true,
    imageFile: null
  });
  const [rewardMessage, setRewardMessage] = useState('');

  // Editing state
  const [editingItem, setEditingItem] = useState(null);
  const [editingReward, setEditingReward] = useState(null);

  // Theme styling
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-50 text-neutral-900';
  const cardClass = isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200';
  const textMuted = isDark ? 'text-neutral-400' : 'text-neutral-500';
  const textLabel = isDark ? 'text-neutral-200 font-medium' : 'text-neutral-800 font-semibold';
  const textInput = isDark ? 'bg-neutral-800 border-neutral-700 text-white focus:border-amber-500' : 'bg-white border-neutral-300 text-neutral-900 focus:border-amber-600';
  const tabBg = isDark ? 'bg-neutral-800' : 'bg-neutral-200';
  const tabActive = isDark ? 'bg-amber-500 text-neutral-900 font-bold' : 'bg-amber-600 text-white font-bold';
  const tabInactive = isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-900';
  const borderClass = isDark ? 'border-neutral-700' : 'border-neutral-200';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, ordersData, resData, menuData, rewardsData, historyData, reviewsData, eventsData] = await Promise.all([
        apiFetch('/admin/users').catch(() => []),
        apiFetch('/admin/orders').catch(() => []),
        apiFetch('/admin/reservations').catch(() => []),
        apiFetch('/menu').catch(() => []),
        apiFetch('/rewards?all=true').catch(() => []),
        apiFetch('/rewards/history').catch(() => []),
        apiFetch('/admin/reviews').catch(() => []),
        apiFetch('/events/requests').catch(() => [])
      ]);
      setUsers(usersData);
      setOrders(ordersData);
      setReservations(resData);
      setMenuItems(menuData);
      setRewards(rewardsData);
      setRewardHistory(historyData);
      setReviews(reviewsData);
      setEventRequests(eventsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Menu Management Handlers
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setMenuMessage('Adding item...');
    try {
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('category', newItem.category);
      formData.append('type', newItem.type);
      formData.append('price', newItem.price);
      formData.append('description', newItem.description);
      formData.append('availability', newItem.availability);
      formData.append('isChefSpecial', newItem.isChefSpecial);
      if (newItem.imageFile) {
        formData.append('image', newItem.imageFile);
      }

      await apiFetch('/menu', {
        method: 'POST',
        body: formData
      });
      setMenuMessage('Item added successfully!');
      setNewItem({
        name: '',
        category: 'Starters',
        type: 'veg',
        price: '',
        description: '',
        isChefSpecial: false,
        availability: 'Available',
        imageFile: null
      });
      if (document.getElementById('menu-image-file')) {
        document.getElementById('menu-image-file').value = '';
      }
      fetchData();
      setTimeout(() => setMenuMessage(''), 3000);
    } catch (err) {
      setMenuMessage('Failed to add item: ' + err.message);
    }
  };

  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editingItem.name);
      formData.append('category', editingItem.category);
      formData.append('type', editingItem.type);
      formData.append('price', editingItem.price);
      formData.append('description', editingItem.description);
      formData.append('availability', editingItem.availability);
      formData.append('isChefSpecial', editingItem.isChefSpecial);
      if (editingItem.imageFile) {
        formData.append('image', editingItem.imageFile);
      } else {
        formData.append('image', editingItem.image);
      }

      await apiFetch(`/menu/${editingItem._id}`, {
        method: 'PUT',
        body: formData
      });
      setEditingItem(null);
      fetchData();
      alert('Menu item updated successfully!');
    } catch (err) {
      alert('Failed to update item: ' + err.message);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await apiFetch(`/menu/${id}`, {
          method: 'DELETE'
        });
        fetchData();
        alert('Menu item deleted successfully!');
      } catch (err) {
        alert('Failed to delete item: ' + err.message);
      }
    }
  };

  // Rewards Management Handlers
  const handleAddReward = async (e) => {
    e.preventDefault();
    setRewardMessage('Adding reward...');
    try {
      const formData = new FormData();
      formData.append('name', newReward.name);
      formData.append('pointsCost', newReward.pointsCost);
      formData.append('description', newReward.description);
      formData.append('isActive', newReward.isActive);
      if (newReward.imageFile) {
        formData.append('image', newReward.imageFile);
      }

      await apiFetch('/rewards', {
        method: 'POST',
        body: formData
      });
      setRewardMessage('Reward added successfully!');
      setNewReward({
        name: '',
        pointsCost: '',
        description: '',
        isActive: true,
        imageFile: null
      });
      if (document.getElementById('reward-image-file')) {
        document.getElementById('reward-image-file').value = '';
      }
      fetchData();
      setTimeout(() => setRewardMessage(''), 3000);
    } catch (err) {
      setRewardMessage('Failed to add reward: ' + err.message);
    }
  };

  const handleUpdateReward = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editingReward.name);
      formData.append('pointsCost', editingReward.pointsCost);
      formData.append('description', editingReward.description);
      formData.append('isActive', editingReward.isActive);
      if (editingReward.imageFile) {
        formData.append('image', editingReward.imageFile);
      } else {
        formData.append('image', editingReward.image);
      }

      await apiFetch(`/rewards/${editingReward._id}`, {
        method: 'PUT',
        body: formData
      });
      setEditingReward(null);
      fetchData();
      alert('Reward updated successfully!');
    } catch (err) {
      alert('Failed to update reward: ' + err.message);
    }
  };

  const handleDeleteReward = async (id) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      try {
        await apiFetch(`/rewards/${id}`, {
          method: 'DELETE'
        });
        fetchData();
        alert('Reward deleted successfully!');
      } catch (err) {
        alert('Failed to delete reward: ' + err.message);
      }
    }
  };

  const handleReviewStatusUpdate = async (id, status) => {
    try {
      await apiFetch(`/admin/reviews/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      alert(`Review ${status} successfully!`);
      fetchData();
    } catch (err) {
      alert(`Failed to update review status: ${err.message}`);
    }
  };

  const handleUpdateEventStatus = async (id, status) => {
    try {
      await apiFetch(`/events/requests/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      alert(`Event status updated to ${status} successfully!`);
      fetchData();
    } catch (err) {
      alert(`Failed to update event status: ${err.message}`);
    }
  };

  const handleDeleteEventRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this event request?')) {
      try {
        await apiFetch(`/events/requests/${id}`, {
          method: 'DELETE'
        });
        alert('Event request deleted successfully!');
        fetchData();
      } catch (err) {
        alert(`Failed to delete event request: ${err.message}`);
      }
    }
  };

  const tabs = [
    { id: 'users', label: 'Users' },
    { id: 'orders', label: 'Orders' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'menu', label: 'Menu Management' },
    { id: 'rewards', label: 'Rewards Management' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'events', label: 'Event Requests' }
  ];

  return (
    <div className={`min-h-screen pt-28 pb-12 transition-colors duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-serif text-amber-500 mb-2 font-bold">Admin Dashboard</h1>
          <p className={textMuted}>Manage users, orders, reservations, menu catalog, and rewards system.</p>
        </motion.div>

        {/* Tabs */}
        <div className={`flex flex-wrap p-1 rounded-xl mb-8 w-fit gap-1 ${tabBg}`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab.id ? tabActive : tabInactive
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl border ${cardClass} overflow-hidden shadow-md`}
          >
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${borderClass} bg-black/5`}>
                      <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Name</th>
                      <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Email</th>
                      <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Role</th>
                      <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Tier</th>
                      <th className={`p-4 font-serif font-medium text-right ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className={`border-b ${borderClass} last:border-0 hover:bg-black/5 transition-colors`}>
                        <td className={`p-4 font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{u.name}</td>
                        <td className={`p-4 ${textMuted}`}>{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className={`p-4 font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>{u.tier}</td>
                        <td className={`p-4 text-right font-semibold ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{u.points}</td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="5" className={`p-8 text-center ${textMuted}`}>No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${borderClass} bg-black/5`}>
                      <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Order ID</th>
                      <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Customer</th>
                      <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Status</th>
                      <th className={`p-4 font-serif font-medium text-right ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id} className={`border-b ${borderClass} last:border-0 hover:bg-black/5 transition-colors`}>
                        <td className={`p-4 font-mono text-sm ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>{o._id.slice(-6)}</td>
                        <td className={`p-4 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{o.userId?.name || o.guestEmail || 'Unknown'}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-500">
                            {o.status}
                          </span>
                        </td>
                        <td className={`p-4 text-right font-bold ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>₹{o.total}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="4" className={`p-8 text-center ${textMuted}`}>No orders found yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${borderClass} bg-black/5`}>
                      <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Res ID</th>
                      <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Guest Name</th>
                      <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Date & Time</th>
                      <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Table</th>
                      <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Guests</th>
                      <th className={`p-4 font-serif font-medium text-right ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(r => (
                      <tr key={r._id} className={`border-b ${borderClass} last:border-0 hover:bg-black/5 transition-colors`}>
                        <td className={`p-4 font-mono text-sm ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>{r._id.slice(-6)}</td>
                        <td className={`p-4 font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{r.name}<br/><span className={`text-xs ${textMuted}`}>{r.phone}</span></td>
                        <td className={`p-4 ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>{new Date(r.date).toLocaleDateString()} {r.time || '19:00'}</td>
                        <td className={`p-4 font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>T{r.table}</td>
                        <td className={`p-4 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{r.guests}</td>
                        <td className="p-4 text-right">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-500">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {reservations.length === 0 && (
                      <tr>
                        <td colSpan="6" className={`p-8 text-center ${textMuted}`}>No reservations found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Menu Management Tab */}
            {activeTab === 'menu' && (
              <div className="p-6">
                <h2 className="text-2xl font-serif mb-6 text-amber-500 font-bold border-b pb-2 border-neutral-700/10">Menu Catalog Management</h2>
                
                {/* Form to Add Item */}
                <form onSubmit={handleAddMenuItem} className="space-y-4 max-w-4xl mb-12 p-6 rounded-xl border border-neutral-700/10 bg-neutral-500/5">
                  <h3 className={`text-lg font-serif mb-4 ${isDark ? 'text-neutral-200' : 'text-neutral-800'} font-bold`}>Add New Menu Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Name</label>
                      <input required type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`} placeholder="e.g. Garlic Bread" />
                    </div>
                    <div>
                      <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Price (₹)</label>
                      <input required type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`} placeholder="e.g. 299" />
                    </div>
                    <div>
                      <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Category</label>
                      <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`}>
                        <option value="Starters">Starters</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Beverages">Beverages</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Type</label>
                      <select value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`}>
                        <option value="veg">Vegetarian</option>
                        <option value="non-veg">Non-Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Availability</label>
                      <select value={newItem.availability} onChange={e => setNewItem({...newItem, availability: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`}>
                        <option value="Available">Available</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Food Image Upload</label>
                      <input id="menu-image-file" type="file" onChange={e => setNewItem({...newItem, imageFile: e.target.files[0]})} className={`w-full p-1 rounded-lg border text-xs outline-none transition-all ${textInput}`} />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Description</label>
                    <textarea required rows="2" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`} placeholder="Brief food description..." />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="chefSpecial" checked={newItem.isChefSpecial} onChange={e => setNewItem({...newItem, isChefSpecial: e.target.checked})} className="w-4 h-4 accent-amber-500" />
                    <label htmlFor="chefSpecial" className={`text-sm ${isDark ? 'text-neutral-200' : 'text-neutral-800'} font-medium cursor-pointer`}>Mark as Chef's Special</label>
                  </div>
                  <div className="pt-2 flex items-center gap-4">
                    <button type="submit" className="px-6 py-2.5 bg-amber-500 text-neutral-900 rounded-lg font-bold hover:bg-amber-400 transition-colors uppercase tracking-wider text-xs cursor-pointer">
                      Add Menu Item
                    </button>
                    {menuMessage && <span className="text-sm text-amber-500 font-semibold">{menuMessage}</span>}
                  </div>
                </form>

                {/* List of Menu Items */}
                <h3 className={`text-lg font-serif mb-4 ${isDark ? 'text-neutral-200' : 'text-neutral-800'} font-bold`}>Current Menu Items</h3>
                <div className="overflow-x-auto border border-neutral-700/10 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${borderClass} bg-black/5`}>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Image</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Name</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Category</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Type</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Price</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Availability</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Chef Special</th>
                        <th className={`p-4 font-serif font-medium text-center ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map(item => (
                        <tr key={item._id} className={`border-b ${borderClass} last:border-0 hover:bg-black/5 transition-colors`}>
                          <td className="p-4">
                            <img src={item.image || 'https://images.unsplash.com/photo-1544025162-811114bd0a0e?w=100&fit=crop'} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-gold/20" />
                          </td>
                          <td className={`p-4 font-bold ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{item.name}</td>
                          <td className={`p-4 ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>{item.category}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${item.type === 'veg' ? 'bg-emerald-500/20 text-emerald-500' : item.type === 'vegan' ? 'bg-teal-500/20 text-teal-500' : 'bg-red-500/20 text-red-500'}`}>
                              {item.type}
                            </span>
                          </td>
                          <td className={`p-4 font-bold ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>₹{item.price}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.availability === 'Available' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                              {item.availability || 'Available'}
                            </span>
                          </td>
                          <td className={`p-4 font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>{item.isChefSpecial ? '⭐ Yes' : 'No'}</td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => setEditingItem(item)} className="px-3 py-1 bg-amber-500/20 text-amber-600 hover:bg-amber-500 hover:text-neutral-900 rounded font-semibold text-xs transition-colors cursor-pointer">
                                Edit
                              </button>
                              <button onClick={() => handleDeleteMenuItem(item._id)} className="px-3 py-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded font-semibold text-xs transition-colors cursor-pointer">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {menuItems.length === 0 && (
                        <tr>
                          <td colSpan="8" className={`p-8 text-center ${textMuted}`}>No menu items found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Rewards Management Tab */}
            {activeTab === 'rewards' && (
              <div className="p-6">
                <h2 className="text-2xl font-serif mb-6 text-amber-500 font-bold border-b pb-2 border-neutral-700/10">Loyalty Rewards Management</h2>
                
                {/* Form to Add Reward */}
                <form onSubmit={handleAddReward} className="space-y-4 max-w-4xl mb-12 p-6 rounded-xl border border-neutral-700/10 bg-neutral-500/5">
                  <h3 className={`text-lg font-serif mb-4 ${isDark ? 'text-neutral-200' : 'text-neutral-800'} font-bold`}>Add New Reward Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Reward Name</label>
                      <input required type="text" value={newReward.name} onChange={e => setNewReward({...newReward, name: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`} placeholder="e.g. Free Dessert" />
                    </div>
                    <div>
                      <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Points Required</label>
                      <input required type="number" value={newReward.pointsCost} onChange={e => setNewReward({...newReward, pointsCost: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`} placeholder="e.g. 500" />
                    </div>
                    <div>
                      <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Reward Image Upload</label>
                      <input id="reward-image-file" type="file" onChange={e => setNewReward({...newReward, imageFile: e.target.files[0]})} className={`w-full p-1 rounded-lg border text-xs outline-none transition-all ${textInput}`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Status</label>
                      <select value={newReward.isActive} onChange={e => setNewReward({...newReward, isActive: e.target.value === 'true'})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`}>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Description</label>
                      <input required type="text" value={newReward.description} onChange={e => setNewReward({...newReward, description: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`} placeholder="e.g. Redeem for any classic dessert item" />
                    </div>
                  </div>
                  <div className="pt-2 flex items-center gap-4">
                    <button type="submit" className="px-6 py-2.5 bg-amber-500 text-neutral-900 rounded-lg font-bold hover:bg-amber-400 transition-colors uppercase tracking-wider text-xs cursor-pointer">
                      Add Reward
                    </button>
                    {rewardMessage && <span className="text-sm text-amber-500 font-semibold">{rewardMessage}</span>}
                  </div>
                </form>

                {/* List of Rewards */}
                <h3 className={`text-lg font-serif mb-4 ${isDark ? 'text-neutral-200' : 'text-neutral-800'} font-bold`}>Available Rewards</h3>
                <div className="overflow-x-auto border border-neutral-700/10 rounded-xl mb-12">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${borderClass} bg-black/5`}>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Image</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Name</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Points Cost</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Description</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Status</th>
                        <th className={`p-4 font-serif font-medium text-center ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rewards.map(r => (
                        <tr key={r._id} className={`border-b ${borderClass} last:border-0 hover:bg-black/5 transition-colors`}>
                          <td className="p-4">
                            <img src={r.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&fit=crop'} alt={r.name} className="w-12 h-12 object-cover rounded-lg border border-gold/20" />
                          </td>
                          <td className={`p-4 font-bold ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{r.name}</td>
                          <td className={`p-4 font-bold text-amber-500`}>{r.pointsCost} Points</td>
                          <td className={`p-4 text-sm ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>{r.description}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.isActive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                              {r.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => setEditingReward(r)} className="px-3 py-1 bg-amber-500/20 text-amber-600 hover:bg-amber-500 hover:text-neutral-900 rounded font-semibold text-xs transition-colors cursor-pointer">
                                Edit
                              </button>
                              <button onClick={() => handleDeleteReward(r._id)} className="px-3 py-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded font-semibold text-xs transition-colors cursor-pointer">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {rewards.length === 0 && (
                        <tr>
                          <td colSpan="6" className={`p-8 text-center ${textMuted}`}>No rewards found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Redeemed Rewards History */}
                <h3 className={`text-lg font-serif mb-4 ${isDark ? 'text-neutral-200' : 'text-neutral-800'} font-bold`}>Redeemed Rewards History</h3>
                <div className="overflow-x-auto border border-neutral-700/10 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${borderClass} bg-black/5`}>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Date</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Customer</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Email</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Description</th>
                        <th className={`p-4 font-serif font-medium text-right ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Points Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rewardHistory.map(log => (
                        <tr key={log._id} className={`border-b ${borderClass} last:border-0 hover:bg-black/5 transition-colors`}>
                          <td className={`p-4 text-sm ${textMuted}`}>{new Date(log.date).toLocaleString()}</td>
                          <td className={`p-4 font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{log.userId?.name || 'Deleted User'}</td>
                          <td className={`p-4 text-sm ${textMuted}`}>{log.userId?.email || 'N/A'}</td>
                          <td className={`p-4 ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>{log.description}</td>
                          <td className="p-4 text-right font-bold text-amber-500">-{log.points} pts</td>
                        </tr>
                      ))}
                      {rewardHistory.length === 0 && (
                        <tr>
                          <td colSpan="5" className={`p-8 text-center ${textMuted}`}>No redemptions found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="p-6">
                <h3 className={`text-lg font-serif mb-4 ${isDark ? 'text-neutral-200' : 'text-neutral-800'} font-bold`}>FAQ & Guest Reviews</h3>
                <div className="overflow-x-auto border border-neutral-700/10 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${borderClass} bg-black/5`}>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Date</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Customer Name</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Rating</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Comment</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Status</th>
                        <th className={`p-4 font-serif font-medium text-center ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map(review => (
                        <tr key={review._id} className={`border-b ${borderClass} last:border-0 hover:bg-black/5 transition-colors`}>
                          <td className={`p-4 text-xs ${textMuted}`}>{new Date(review.createdAt).toLocaleDateString()}</td>
                          <td className={`p-4 font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{review.userName}</td>
                          <td className="p-4 text-amber-500 font-bold">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)} ({review.rating}/5)</td>
                          <td className={`p-4 text-sm max-w-xs truncate ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`} title={review.message}>
                            {review.message}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                              review.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-500'
                                : review.status === 'rejected'
                                  ? 'bg-red-500/20 text-red-500'
                                  : 'bg-amber-500/20 text-amber-500'
                            }`}>
                              {review.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {review.status === 'pending' ? (
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => handleReviewStatusUpdate(review._id, 'approved')}
                                  className="px-3 py-1 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded font-semibold text-xs transition-colors cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReviewStatusUpdate(review._id, 'rejected')}
                                  className="px-3 py-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded font-semibold text-xs transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className={`text-xs ${textMuted}`}>{review.rewardGiven ? 'Points Earned' : 'N/A'}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {reviews.length === 0 && (
                        <tr>
                          <td colSpan="6" className={`p-8 text-center ${textMuted}`}>No reviews found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="p-6">
                <h3 className={`text-lg font-serif mb-4 ${isDark ? 'text-neutral-200' : 'text-neutral-800'} font-bold`}>Event Requests Management</h3>
                <div className="overflow-x-auto border border-neutral-700/10 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${borderClass} bg-black/5`}>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Customer</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Event Date</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Guests</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Event Type</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Venue</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Dietary / Preferences</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Message</th>
                        <th className={`p-4 font-serif font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Status</th>
                        <th className={`p-4 font-serif font-medium text-center ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventRequests.map(req => (
                        <tr key={req._id} className={`border-b ${borderClass} last:border-0 hover:bg-black/5 transition-colors`}>
                          <td className="p-4">
                            <div className={`font-semibold ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{req.name}</div>
                            <div className={`text-xs ${textMuted}`}>{req.email}</div>
                            <div className={`text-xs ${textMuted}`}>{req.phone}</div>
                          </td>
                          <td className={`p-4 text-sm ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                            {new Date(req.date).toLocaleDateString()}
                          </td>
                          <td className={`p-4 text-sm font-semibold ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                            {req.guests}
                          </td>
                          <td className={`p-4 text-sm capitalize ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                            {req.eventType}
                          </td>
                          <td className={`p-4 text-sm capitalize ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                            {req.venue}
                          </td>
                          <td className={`p-4 text-sm max-w-[150px] truncate ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`} title={req.dietary}>
                            {req.dietary || <span className="italic text-xs opacity-50">None</span>}
                          </td>
                          <td className={`p-4 text-sm max-w-[150px] truncate ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`} title={req.message}>
                            {req.message || <span className="italic text-xs opacity-50">None</span>}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              req.status === 'Confirmed'
                                ? 'bg-emerald-500/20 text-emerald-500'
                                : req.status === 'Cancelled'
                                  ? 'bg-red-500/20 text-red-500'
                                  : req.status === 'Contacted'
                                    ? 'bg-blue-500/20 text-blue-500'
                                    : 'bg-amber-500/20 text-amber-500'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                              <select
                                value={req.status}
                                onChange={(e) => handleUpdateEventStatus(req._id, e.target.value)}
                                className={`text-xs p-1 rounded border ${isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-200' : 'bg-white border-neutral-300 text-neutral-800'} cursor-pointer outline-none`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <button
                                onClick={() => handleDeleteEventRequest(req._id)}
                                className="px-2 py-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded font-semibold text-xs transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {eventRequests.length === 0 && (
                        <tr>
                          <td colSpan="9" className={`p-8 text-center ${textMuted}`}>No event requests found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Editing Menu Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-2xl border ${borderClass} ${isDark ? 'bg-neutral-900 text-neutral-100' : 'bg-white text-neutral-900'} p-6 max-h-[90vh] overflow-y-auto shadow-2xl`}>
            <h3 className="text-2xl font-serif mb-6 text-amber-500 font-bold">Edit Menu Item</h3>
            <form onSubmit={handleUpdateMenuItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Name</label>
                  <input required type="text" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`} />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Price (₹)</label>
                  <input required type="number" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`} />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Category</label>
                  <select value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`}>
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Type</label>
                  <select value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`}>
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Availability</label>
                  <select value={editingItem.availability} onChange={e => setEditingItem({...editingItem, availability: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`}>
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Replace Image File</label>
                  <input type="file" onChange={e => setEditingItem({...editingItem, imageFile: e.target.files[0]})} className={`w-full p-1 rounded-lg border text-xs outline-none transition-all ${textInput}`} />
                </div>
              </div>
              <div>
                <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Description</label>
                <textarea required rows="2" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="editChefSpecial" checked={editingItem.isChefSpecial} onChange={e => setEditingItem({...editingItem, isChefSpecial: e.target.checked})} className="w-4 h-4 accent-amber-500" />
                <label htmlFor="editChefSpecial" className={`text-sm ${isDark ? 'text-neutral-200' : 'text-neutral-800'} font-medium cursor-pointer`}>Mark as Chef's Special</label>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-neutral-700/10">
                <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2.5 border rounded-lg hover:bg-black/10 transition-colors cursor-pointer text-sm font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-amber-500 text-neutral-900 rounded-lg font-bold hover:bg-amber-400 transition-colors cursor-pointer text-sm uppercase tracking-wider">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editing Reward Item Modal */}
      {editingReward && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-2xl border ${borderClass} ${isDark ? 'bg-neutral-900 text-neutral-100' : 'bg-white text-neutral-900'} p-6 max-h-[90vh] overflow-y-auto shadow-2xl`}>
            <h3 className="text-2xl font-serif mb-6 text-amber-500 font-bold">Edit Reward Item</h3>
            <form onSubmit={handleUpdateReward} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Reward Name</label>
                  <input required type="text" value={editingReward.name} onChange={e => setEditingReward({...editingReward, name: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`} />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Points Cost</label>
                  <input required type="number" value={editingReward.pointsCost} onChange={e => setEditingReward({...editingReward, pointsCost: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Status</label>
                  <select value={editingReward.isActive} onChange={e => setEditingReward({...editingReward, isActive: e.target.value === 'true'})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Replace Image File</label>
                  <input type="file" onChange={e => setEditingReward({...editingReward, imageFile: e.target.files[0]})} className={`w-full p-1 rounded-lg border text-xs outline-none transition-all ${textInput}`} />
                </div>
              </div>
              <div>
                <label className={`block text-xs uppercase tracking-wider ${textLabel} mb-1`}>Description</label>
                <textarea required rows="2" value={editingReward.description} onChange={e => setEditingReward({...editingReward, description: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm outline-none transition-all ${textInput}`} />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-neutral-700/10">
                <button type="button" onClick={() => setEditingReward(null)} className="px-5 py-2.5 border rounded-lg hover:bg-black/10 transition-colors cursor-pointer text-sm font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-amber-500 text-neutral-900 rounded-lg font-bold hover:bg-amber-400 transition-colors cursor-pointer text-sm uppercase tracking-wider">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
