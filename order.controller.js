const Order = require("../models/Order.model");

// Create Order
const createOrder = async (req, res) => {
  try {
    const { userEmail, menuItems, total, type } = req.body;

    // Check for required fields
    if (!userEmail || !menuItems || !total || !type) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    // Check if type is valid
    if (type !== "BREAKFAST" && type !== "LUNCH" && type !== "DINNER") {
      return res.status(400).json({ msg: "Invalid type" });
    }

    // Create new order
    const order = new Order({
      userEmail,
      menuItems,
      total,
      type,
    });

    // Save order to database
    await order.save();

    res.status(201).json({ msg: "Order created successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Single Order
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update Order
const updateOrder = async (req, res) => {
  try {
    const { userEmail, menuItems, total, type } = req.body;

    // Check if order exists
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Check if type is valid
    if (type && type !== "BREAKFAST" && type !== "LUNCH" && type !== "DINNER") {
      return res.status(400).json({ msg: "Invalid type" });
    }

    // Update order
    order.userEmail = userEmail || order.userEmail;
    order.menuItems = menuItems || order.menuItems;
    order.total = total || order.total;
    order.type = type || order.type;

    // Save updated order to database
    await order.save();

    res.json({ msg: "Order updated successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  try {
    // Check if order exists
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    await Order.deleteOne({ _id: req.params.id });

    res.json({ msg: "Order deleted successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Orders by User Email
const getOrdersByUserEmail = async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.params.userEmail })
      .populate({
        path: "menuItems.menuItemId",
        model: "MenuItem",
        select: "name price",
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ msg: "Orders fetched successfully", orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUserEmail,
};
