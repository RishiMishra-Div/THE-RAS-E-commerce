const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");
const { isloggedIn} = require("../middleware/isloggedIn");
const {isAdmin } = require('../middlewares/isAdmin')

// Get all orders (ADMIN ONLY)
router.get("/", isloggedIn, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "fullname email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update order status
router.put("/:id", isloggedIn, isAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updatedOrder);
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

// Delete order
router.delete("/:id", isloggedIn, isAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
