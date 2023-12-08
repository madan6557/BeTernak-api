// src/routes.js
const express = require('express');
const router = express.Router();
const {
  getUserInfoById,
  getProductByCategory,
  getProductById,
  getProductByBrand,
  getOrdersByUserId,
  getOrdersById,
  getBrandsByUserId,
  getCartByUserId,
  getReviewsByProduct,
  getReviewsByBrand,
  addUser,
  addProduct,
  addOrder,
  addToCart,
  updateUserById,
  getPrediction,
} = require('./handler');

// Rute mendapatkan user info berdsarkan ID
router.get('/api/users/id/:userId', getUserInfoById);

// Rute untuk mendapatkan produk berdasarkan kategori
router.get('/api/products/category/:categoryId', getProductByCategory);

// Rute untuk mendapatkan produk berdasarkan ID produk
router.get('/api/products/id/:productId', getProductById);

// Rute untuk mendapatkan produk berdasarkan ID brand
router.get('/api/products/brand/:brandId', getProductByBrand);

// Rute untuk mendapatkan pesanan berdasarkan ID pengguna
router.get('/api/orders/user/:userId', getOrdersByUserId);

// Rute untuk mendapatkan pesanan berdasarkan ID pengguna
router.get('/api/orders/id/:orderId', getOrdersById);

// Rute untuk mendapatkan merek (brands) berdasarkan ID pengguna
router.get('/api/brands/user/:userId', getBrandsByUserId);

// Rute untuk mendapatkan isi keranjang (cart) berdasarkan ID pengguna
router.get('/api/cart/user/:userId', getCartByUserId);

//Rute ubtuk mendapatkan review product
router.get('/api/reviews/product/:productId', getReviewsByProduct);

//Rute ubtuk mendapatkan review brand
router.get('/api/reviews/brand/:brandId', getReviewsByBrand);

// Rute untuk menambahkan user baru
router.post('/api/users/add', addUser);

// Rute untuk menambah produk baru
router.post('/api/products/add', addProduct);

// Rute Menambahkan order baru
router.post('/api/orders/add', addOrder);

// Rute Menambahkan ke keranjang
router.post('/api/cart/add', addToCart);

// Rute Update user_info berdasarkan ID
router.put('/api/users/update/:userId', updateUserById);

module.exports = router;
