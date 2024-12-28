const express = require('express');
const cloudinary = require('../cloudinaryconfig');
const User = require('../models/User'); // User model
const Order = require('../models/Order');
const mongoose = require('mongoose');


const router = express.Router();


// DELETE an order
router.delete('/deleteOrder/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the order from the Order model
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Remove the order from the User's orders array
    const user = await User.findById(order.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the order from the user's orders array
    const orderIndex = user.orders.findIndex(
      (userOrder) => userOrder.orderId.toString() === orderId
    );
    if (orderIndex !== -1) {
      user.orders.splice(orderIndex, 1);
      await user.save(); // Save the updated user document
    }

    // Remove the order from the client's orders array (if applicable)
    for (const client of user.clients) {
      const clientOrderIndex = client.orders.findIndex(
        (clientOrder) => clientOrder.orderId.toString() === orderId
      );
      if (clientOrderIndex !== -1) {
        client.orders.splice(clientOrderIndex, 1);
        await user.save(); // Save the updated user document after modifying client's orders
      }
    }

    // Now, delete the order from the Order model itself
    await Order.findByIdAndDelete(orderId);

    // Return success response
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});





//get all orders of a user
router.get('/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user without populating orders (since the products are already embedded in the user document)
    const user = await User.findById(userId).lean();  // Use .lean() for better performance

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure orders field exists and is an array
    if (!user.orders || !Array.isArray(user.orders)) {
      return res.status(400).json({ message: 'No orders available' });
    }

    // Map through orders to structure the response
    const orders = await Promise.all(user.orders.map(async (userOrder) => {
      // Fetch the actual order data from the Order model (this will include orderStatus and dateOfOrder)
      const order = await Order.findById(userOrder.orderId);

      if (!order) return null;  // If no matching order found, skip this entry

      const client = user.clients.find((client) => client._id.toString() === userOrder.clientId);

      return {
        orderId: order._id,
        client: client
          ? { name: client.name, address: client.address, phoneNo: client.phoneNo }
          : null,
        products: userOrder.products.map((product) => ({
          product_name: product.product_name,
          product_quantity: product.product_quantity,
          product_price: product.product_price,
          totalPrice: product.totalPrice,
          product_pictures: product.product_pictures,
        })),
        totalAmount: userOrder.products.reduce((acc, product) => acc + product.totalPrice, 0),
        orderStatus: order.orderStatus,  // Getting orderStatus from Order model
        dateOfOrder: order.dateOfOrder,  // Getting dateOfOrder from Order model
      };
    }));

    res.json({ orders: orders.filter(order => order !== null) });  // Filter out null orders
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});









// Get all products for  user
router.get('/getProducts/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
//get all clients
router.get('/getClients/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send('User not found');

    res.json(user.clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).send('Server error');
  }
});

// Create a new order
router.post('/addOrder', async (req, res) => {
  try {
    const { userId, clientId, products, totalAmount } = req.body;
    console.log("this is orderData: ", req.body);

    // Get the user who is placing the order
    const user = await User.findById(userId); // Assuming user is authenticated
    if (!user) return res.status(400).send('User not found');

    // Check if selected products are available in the user's product list and update quantities
    const updatedProducts = [];
    for (const product of products) {
      const productInInventory = user.products.find(p => p._id.toString() === product.productId);
      if (!productInInventory || productInInventory.product_quantity < product.quantity) {
        return res.status(401).send('Insufficient product quantity');
      }

      // Deduct quantity from the product
      productInInventory.product_quantity -= product.quantity;
      updatedProducts.push(productInInventory);
    }

    // Save the updated products in the user schema
    await user.save();

    // Create the order
    const newOrder = new Order({
      userId,
      clientId,
      products: products.map(p => {
        const productInInventory = user.products.find(prod => prod._id.toString() === p.productId);
        return {
          productId: p.productId, // Ensure productId is passed here
          product_name: p.product_name, // Include product name
          price: p.price, // Include price (product_price)
          quantity: p.quantity,
          totalPrice: p.totalPrice,
          product_pictures: productInInventory ? productInInventory.product_pictures : [], // Fetch pictures from inventory
        };
      }),
      totalAmount,
    });

    await newOrder.save();

    // Add the order to the client's orders array
    const clientIndex = user.clients.findIndex(client => client._id.toString() === clientId);
    if (clientIndex !== -1) {
      user.clients[clientIndex].orders.push({ orderId: newOrder._id });
      await user.save(); // Save the updated user with the new order
    }

    // Add the order to the user's orders array
    user.orders.push({
      orderId: newOrder._id,
      clientId: clientId,
      products: products.map(p => {
        const productInInventory = user.products.find(prod => prod._id.toString() === p.productId);
        return {
          productId: p.productId,
          product_name: p.product_name,
          product_price: p.price,
          product_quantity: p.quantity,
          product_pictures: productInInventory ? productInInventory.product_pictures : [],
          totalPrice: p.totalPrice,
        };
      }),
    });

    await user.save(); // Save the updated user with the new order

    // Return response
    res.status(200).send('Order placed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});






// Add a new product
router.post('/products', async (req, res) => {
  console.log('Request body:', req.body); // Log the incoming data
  const { userId, product_name, product_price, product_quantity, images } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(405).json({ message: 'User not found' });
    }

    // Create the product object
    const product = {
      product_name,
      product_price,
      product_quantity,
      product_pictures: images, // Use the Cloudinary URLs
    };

    // Save product to the user's products array
    user.products.push(product);
    await user.save();

    res.status(200).json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all products of the user
router.get('/products', async (req, res) => {
  const { userId } = req.query;  // Ensure 'userId' is passed as a query parameter
 
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await User.findById(userId).populate('products');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ products: user.products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// PUT to update a product
router.put('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  const { product_name, product_price, product_quantity, images } = req.body;

  try {
    const updatedProduct = await User.updateOne(
      { 'products._id': productId }, // Find user that contains the product with the given productId
      {
        $set: {
          'products.$.product_name': product_name,
          'products.$.product_price': product_price,
          'products.$.product_quantity': product_quantity,
          'products.$.product_pictures': images
        }
      }
    );
    if (updatedProduct.nModified === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// DELETE a product
router.delete('/products/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await User.updateOne(
      { 'products._id': productId }, // Find the user with the productId
      { $pull: { products: { _id: productId } } } // Pull the product from the user's products array
    );
    if (deletedProduct.nModified === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




// Create a client
router.post('/clients', async (req, res) => {
  const { userId, name, address, phoneNo } = req.body;

  try {
    if (!name || !address || !phoneNo) {
      return res.status(400).json({ message: 'Name, address, and phone number are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newClient = { name, address, phoneNo, orders: [] };
    user.clients.push(newClient);
    await user.save();

    res.status(201).json({ message: 'Client added successfully', client: newClient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all clients
router.get('/clients/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ clients: user.clients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a client
router.delete('/clients/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const { userid } = req.headers;

  try {
    if (!userid) {
      return res.status(400).json({ message: 'User ID is missing in request' });
    }

    const user = await User.findById(userid);
    if (!user) {
      return res.status(405).json({ message: 'User not found' });
    }

    const clientIndex = user.clients.findIndex((client) => client._id.toString() === clientId);
    if (clientIndex === -1) {
      return res.status(406).json({ message: 'Client not found' });
    }

    user.clients.splice(clientIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
