const MenuItem = require("../models/MenuItem.model");

// Create a new menu item
const createMenuItem = async (req, res) => {
  try {
    const { name, price, type } = req.body;

    // Check for required fields
    if (!name || !price || !type) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    // Check if type is valid
    if (type !== "BREAKFAST" && type !== "LUNCH" && type !== "DINNER") {
      return res.status(400).json({ msg: "Invalid type" });
    }

    // Create new menu item
    const menuItem = new MenuItem({
      name,
      price,
      type,
    });

    // Save menu item to database
    await menuItem.save();

    res.status(201).json({ msg: "Menu item created successfully", menuItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all menu items
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get a menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ msg: "Menu item not found" });
    }
    res.json(menuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update a menu item
const updateMenuItem = async (req, res) => {
  try {
    const { name, price, type } = req.body;

    // Check for required fields
    if (!name || !price || !type) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    // Check if type is valid
    if (type !== "BREAKFAST" && type !== "LUNCH" && type !== "DINNER") {
      return res.status(400).json({ msg: "Invalid type" });
    }

    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ msg: "Menu item not found" });
    }

    // Update menu item
    menuItem.name = name;
    menuItem.price = price;
    menuItem.type = type;

    // Save updated menu item to database
    await menuItem.save();

    res.json({ msg: "Menu item updated successfully", menuItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a menu item
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ msg: "Menu item not found" });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({ msg: "Menu item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Menu Items by Type
const getMenuItemsByType = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ type: req.params.type });
    res.json(menuItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByType,
};
