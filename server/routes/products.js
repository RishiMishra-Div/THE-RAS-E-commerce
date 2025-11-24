// Product Routes - Handle all product-related operations
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, isAdmin } = require('../middleware/auth');

// GET all products (public route)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    // Filter by category if provided
    const filter = category ? { category } : {};
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products', details: error.message });
  }
});

// GET categories (public route) - must be before /:id route to avoid matching "categories" as an ID
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories', details: error.message });
  }
});

// GET single product by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product', details: error.message });
  }
});

// CREATE new product (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, price, category, stock, image } = req.body;

    const product = new Product({
      title,
      description,
      price,
      category,
      stock,
      image
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ error: 'Error creating product', details: error.message });
  }
});

// UPDATE product (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, price, category, stock, image } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { title, description, price, category, stock, image },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ error: 'Error updating product', details: error.message });
  }
});

// DELETE product (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product', details: error.message });
  }
});

module.exports = router;
