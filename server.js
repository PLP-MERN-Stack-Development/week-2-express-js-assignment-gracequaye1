// server.js - Starter Express server for Week 2 assignment

// Import required modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { asyncHandler } = require('./utils');
const { NotFoundError, ValidationError } = require('./errors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Logger middleware
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}
app.use(logger);

// Authentication middleware
function authenticate(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== 'mysecretkey') {
    return res.status(401).json({ message: 'Unauthorized: Invalid API key' });
  }
  next();
}

// Validation middleware
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || !price || !category || inStock === undefined) {
    return res.status(400).json({ message: 'All product fields are required' });
  }
  next();
}

// In-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// Product statistics (count by category)
app.get('/api/products/stats', asyncHandler(async (req, res) => {
  const stats = {};
  products.forEach((product) => {
    const category = product.category.toLowerCase();
    stats[category] = (stats[category] || 0) + 1;
  });
  res.json(stats);
}));

// GET all products with filter + pagination
app.get('/api/products', asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 2 } = req.query;
  let filteredProducts = products;

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    currentPage: pageNum,
    totalItems: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / limitNum),
    products: paginatedProducts
  });
}));

// Search products by name
app.get('/api/products/search', asyncHandler(async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: 'Please provide a name to search' });
  }

  const results = products.filter((product) =>
    product.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json(results);
}));

// GET a product by ID
app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST create a new product
app.post('/api/products', authenticate, validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;

    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT update a product
app.put('/api/products/:id', authenticate, validateProduct, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      throw new NotFoundError('Product not found');
    }

    const updatedProduct = { ...products[index], ...req.body };
    products[index] = updatedProduct;

    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

// DELETE a product
app.delete('/api/products/:id', authenticate, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      throw new NotFoundError('Product not found');
    }

    products.splice(index, 1);
    res.status(204).send(); // No content
  } catch (err) {
    next(err);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.name,
    message: err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing
module.exports = app;
