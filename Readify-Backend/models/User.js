// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for User
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Clients array: stores client data
  clients: [
    {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phoneNo: { type: String, required: true },
      orders: [
        {
          orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Reference to Orders collection
        },
      ],
    },
  ],

  // Products array: stores product data
  products: [
    {
      product_name: { type: String, required: true },
      product_price: { type: Number, required: true },
      product_quantity: { type: Number, required: true },
      product_pictures: [{ type: String }], // Array of image URLs
    },
  ],

  // Orders array: stores order data
  orders: [
    {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Reference to the Order model
      clientId: { type: String, required: true },
      products: [
        {
          productId: { type: String, required: true }, 
          product_name: { type: String, required: true },
          product_price: { type: Number, required: true },
          product_quantity: { type: Number, required: true },
          product_pictures: [{ type: String }], // Array of image URLs
          totalPrice: { type: Number, required: true },
        },
      ],
    },
  ],

  // Invoice array: stores invoice data
  invoices: [
    {
      invoiceNum: { type: String, required: true },
      clientId: { type: String, required: true },
      clientName: { type: String, required: true },
      clientAddress: { type: String, required: true },
      products: [
        {
          productId: { type: String, required: true }, 
          product_name: { type: String, required: true },
          product_price: { type: Number, required: true },
          product_quantity: { type: Number, required: true },
          product_pictures: [{ type: String }], // Array of image URLs
          totalPrice: { type: Number, required: true },
        },
      ],
      totalAmount: { type: Number, required: true },
      dateOfIssuance: { type: Date, required: true },
      paymentMethod: {
        type: String,
        enum: ['Online', 'COD'],
        default: 'COD',
        required: true,
      },
      status: {
        type: String,
        enum: ['To be Delivered', 'Delivered'],
        default: 'To be Delivered',
      },
      paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
      },
    },
  ],
});

// Create the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;
