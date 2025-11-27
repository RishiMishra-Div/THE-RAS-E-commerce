const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 👇 Customer Billing Information
  shippingDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },

  // 👇 Order Items
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      title: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],

  // 👇 Price Breakdown
  subtotal: Number,
  shipping: Number,
  tax: Number,
  total: Number,

  paymentMethod: {
    type: String,
    enum: ["cod", "online"],
    default: "cod"
  },

  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
