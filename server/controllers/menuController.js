const MenuItem = require('../models/MenuItem');

const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu item', error: error.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, category, type, price, description, isChefSpecial, availability } = req.body;
    
    let imageUrl = 'https://images.unsplash.com/photo-1544025162-811114bd0a0e?w=800&fit=crop';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const newItem = await MenuItem.create({
      id: Date.now(),
      name,
      category,
      type,
      price: Number(price),
      description,
      isChefSpecial: isChefSpecial === 'true' || isChefSpecial === true,
      availability: availability || 'Available',
      image: imageUrl
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu item', error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { name, category, type, price, description, isChefSpecial, availability } = req.body;
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    let imageUrl = item.image;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    item.name = name || item.name;
    item.category = category || item.category;
    item.type = type || item.type;
    item.price = price !== undefined ? Number(price) : item.price;
    item.description = description || item.description;
    item.isChefSpecial = isChefSpecial !== undefined ? (isChefSpecial === 'true' || isChefSpecial === true) : item.isChefSpecial;
    item.availability = availability || item.availability;
    item.image = imageUrl;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    await MenuItem.deleteOne({ _id: req.params.id });
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
};

module.exports = { getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem };
