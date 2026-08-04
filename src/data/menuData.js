export const menuItems = [
  // Starters
  {
    id: 1, name: 'Truffle Burrata', category: 'Starters', type: 'veg',
    price: 850, description: 'Creamy burrata draped in black truffle oil, heirloom tomatoes, and aged balsamic pearls.',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&h=400&fit=crop'
  },
  {
    id: 2, name: 'Seared Tuna Tataki', category: 'Starters', type: 'non-veg',
    price: 1200, description: 'Premium yellowfin tuna, lightly seared and served with ponzu gel, wasabi cream, and microgreens.',
    image: 'https://images.unsplash.com/photo-1534256958597-7fe685cbd745?w=600&h=400&fit=crop'
  },
  {
    id: 3, name: 'Wild Mushroom Velouté', category: 'Starters', type: 'veg',
    price: 650, description: 'A velvety porcini and chanterelle soup finished with truffle foam and chive oil.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop'
  },
  {
    id: 4, name: 'Lobster Bisque', category: 'Starters', type: 'non-veg',
    price: 1100, description: 'Rich and creamy lobster bisque with cognac cream and fresh dill garnish.',
    image: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=600&h=400&fit=crop'
  },
  // Main Course
  {
    id: 5, name: 'Wagyu Tenderloin', category: 'Main Course', type: 'non-veg',
    price: 4500, description: 'A5-grade wagyu beef, sous-vide to perfection, with potato mousseline and red wine jus.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=400&fit=crop'
  },
  {
    id: 6, name: 'Pan-Roasted Halibut', category: 'Main Course', type: 'non-veg',
    price: 2800, description: 'Atlantic halibut on a bed of saffron risotto with beurre blanc and fennel fronds.',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop'
  },
  {
    id: 7, name: 'Truffle Risotto Nero', category: 'Main Course', type: 'veg',
    price: 1800, description: 'Arborio rice slow-cooked in squid ink, finished with shaved black truffle and parmesan crisp.',
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c1?w=600&h=400&fit=crop'
  },
  {
    id: 8, name: 'Herb-Crusted Lamb Rack', category: 'Main Course', type: 'non-veg',
    price: 3200, description: 'New Zealand lamb rack, herb-crusted, with rosemary potatoes and minted pea purée.',
    image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=600&h=400&fit=crop'
  },
  {
    id: 9, name: 'Miso-Glazed Aubergine', category: 'Main Course', type: 'veg',
    price: 1400, description: 'Roasted Japanese aubergine with white miso glaze, sesame, and pickled ginger.',
    image: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=600&h=400&fit=crop'
  },
  // Desserts
  {
    id: 10, name: 'Valrhona Fondant', category: 'Desserts', type: 'veg',
    price: 950, description: '70% Valrhona dark chocolate fondant with a molten center, vanilla bean ice cream.',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=400&fit=crop'
  },
  {
    id: 11, name: 'Crème Brûlée Trio', category: 'Desserts', type: 'veg',
    price: 780, description: 'Classic vanilla, lavender, and passion fruit crème brûlées with caramelized sugar crust.',
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&h=400&fit=crop'
  },
  {
    id: 12, name: 'Tiramisu Deconstructed', category: 'Desserts', type: 'veg',
    price: 880, description: 'Espresso-soaked savoiardi, mascarpone mousse, and cocoa dust in a modern presentation.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop'
  },
  // Beverages
  {
    id: 13, name: 'Aged Single Malt', category: 'Beverages', type: 'non-veg',
    price: 1500, description: '18-year Highland single malt whisky, served neat with a side of artisanal dark chocolate.',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=400&fit=crop'
  },
  {
    id: 14, name: 'Sommelier\'s Wine Pairing', category: 'Beverages', type: 'veg',
    price: 2200, description: 'A curated flight of three estate-selected wines paired to complement your meal.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop'
  },
  {
    id: 15, name: 'Botanical Elixir', category: 'Beverages', type: 'veg',
    price: 650, description: 'House-crafted non-alcoholic cocktail with elderflower, cucumber, and sparkling tonic.',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&h=400&fit=crop'
  },
  {
    id: 16, name: 'Matcha Ceremony', category: 'Beverages', type: 'veg',
    price: 550, description: 'Ceremonial-grade Uji matcha, whisked to perfection and served with a delicate mochi.',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=400&fit=crop'
  }
];

export const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

export const tables = [
  { id: 1, seats: 2, x: 10, y: 15, status: 'available' },
  { id: 2, seats: 2, x: 30, y: 15, status: 'occupied' },
  { id: 3, seats: 4, x: 55, y: 10, status: 'available' },
  { id: 4, seats: 4, x: 78, y: 15, status: 'available' },
  { id: 5, seats: 6, x: 10, y: 50, status: 'occupied' },
  { id: 6, seats: 6, x: 35, y: 50, status: 'available' },
  { id: 7, seats: 8, x: 62, y: 48, status: 'available' },
  { id: 8, seats: 2, x: 85, y: 50, status: 'occupied' },
  { id: 9, seats: 4, x: 20, y: 82, status: 'available' },
  { id: 10, seats: 8, x: 60, y: 82, status: 'available' },
];

export const tastingMenu = [
  { course: 1, name: 'Amuse-Bouche', title: 'Sea Urchin Gelée', description: 'Delicate uni custard with yuzu foam, edible flowers, and micro shiso.', wine: 'NV Champagne Brut' },
  { course: 2, name: 'Cold Appetizer', title: 'Hamachi Crudo', description: 'Yellowtail sashimi with blood orange, jalapeño, and toasted sesame.', wine: '2022 Sancerre, Loire Valley' },
  { course: 3, name: 'Warm Appetizer', title: 'Foie Gras Torchon', description: 'Silky torchon with brioche toast, Sauternes gelée, and Maldon salt.', wine: '2019 Tokaji Aszú, Hungary' },
  { course: 4, name: 'Intermezzo', title: 'Champagne Sorbet', description: 'Palate cleanser of vintage Champagne granite with mint oil.', wine: '' },
  { course: 5, name: 'Fish Course', title: 'Dover Sole Meunière', description: 'Whole Dover sole, brown butter, capers, and lemon beurre noisette.', wine: '2021 Puligny-Montrachet' },
  { course: 6, name: 'Meat Course', title: 'Wagyu A5 Striploin', description: 'Japanese A5 wagyu, charcoal-grilled, with bone marrow and truffle jus.', wine: '2018 Barolo, Piemonte' },
  { course: 7, name: 'Grand Dessert', title: 'Chocolate Sphere', description: 'Valrhona sphere melted tableside with warm ganache, gold leaf, and raspberry coulis.', wine: '2017 Late Harvest Riesling' },
];

export const dashboardOrders = [
  {
    id: 'ORD-2024-001', date: '2024-12-15', status: 'Completed',
    items: [
      { name: 'Wagyu Tenderloin', qty: 1, price: 4500 },
      { name: 'Truffle Risotto Nero', qty: 1, price: 1800 },
      { name: 'Valrhona Fondant', qty: 2, price: 950 },
      { name: 'Sommelier\'s Wine Pairing', qty: 2, price: 2200 },
    ]
  },
  {
    id: 'ORD-2024-002', date: '2024-11-28', status: 'Completed',
    items: [
      { name: 'Seared Tuna Tataki', qty: 2, price: 1200 },
      { name: 'Pan-Roasted Halibut', qty: 1, price: 2800 },
      { name: 'Crème Brûlée Trio', qty: 1, price: 780 },
    ]
  },
  {
    id: 'ORD-2025-003', date: '2025-01-10', status: 'Completed',
    items: [
      { name: 'Herb-Crusted Lamb Rack', qty: 2, price: 3200 },
      { name: 'Botanical Elixir', qty: 3, price: 650 },
    ]
  },
];

export const dashboardReservations = [
  { id: 'RES-001', date: '2025-07-15', time: '19:30', guests: 4, table: 3, status: 'Confirmed', name: 'Alexander Sterling' },
  { id: 'RES-002', date: '2025-08-02', time: '20:00', guests: 2, table: 1, status: 'Confirmed', name: 'Alexander Sterling' },
  { id: 'RES-003', date: '2025-08-20', time: '19:00', guests: 8, table: 10, status: 'Pending', name: 'Alexander Sterling' },
];

export const ambienceImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=600&fit=crop', title: 'The Grand Dining Hall', subtitle: 'Where stories unfold over extraordinary cuisine' },
  { id: 2, src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop', title: 'The Intimate Lounge', subtitle: 'Craft cocktails and whispered conversations' },
  { id: 3, src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=600&fit=crop', title: 'The Cozy Corner', subtitle: 'An alcove designed for intimate gatherings' },
  { id: 4, src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&h=600&fit=crop', title: 'The Wine Cellar', subtitle: 'A curated collection from the world\'s finest vineyards' },
];
