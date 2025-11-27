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

// creare order route

router.post("/", isloggedIn, async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, address,
      city, state, zipCode, country, items,
      subtotal, shipping, tax, total, paymentMethod
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: "Order must contain items" });
    }

    const newOrder = await Order.create({
      user: req.user._id,
      shippingDetails: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country
      },
      items,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: paymentMethod || "cod",
      status: "pending"
    });

    res.status(201).json({ success: true, order: newOrder });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Order creation failed" });
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
