// models/Order.js
const mongoose = require('mongoose');

// Define the schema for Order
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the order
  clientId: { type: String, required: true }, 
  products: [
    {
      product_name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      totalPrice: { type: Number, required: true }, 
    },
  ],
  totalAmount: { type: Number, required: true }, 
  orderStatus: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending',
    required: true,
  },
  dateOfOrder: { type: Date, default: Date.now }, // Date when the order was placed
});

// Create the Order model
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
