// src/routes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();

const {
  register, 
  login, 
  forgotPassword,
} = require('./handlers/authHandler');

const {
  getUserInfoById,
  getProductByCategory,
  getProductById,
  getProductByBrand,
  getBrandById,
  getOrdersByUserId,
  getOrdersById,
  getBrandsByUserId,
  getCartByUserId,
  getReviewsByProduct,
  getReviewsByBrand,
} = require('./handlers/getHandler');

const {
  addUser,
  addProduct,
  addBrand,
  addOrder,
  addToCart,
  addProductReview,
} = require('./handlers/postHandler');

const {
  updateUserById,
  updateProductById,
  updateOrderById,
  updateCartById,
  updateProductReviewById,
  updateBrandById,
} = require('./handlers/putHandler');

const {
  deleteUserById,
  deleteProductById,
  deleteOrderById,
  deleteCartById,
  deleteProductReviewById,
  deleteBrandById,
} = require('./handlers/deleteHandler');

const storage = multer.memoryStorage(); // Gunakan memori untuk menyimpan file
const upload = multer({ storage: storage });

//Rute untuk autentikasi

// Rute untuk register
router.post('/api/register', register);

// Rute untuk login
router.post('/api/login', login);

// Rute untuk lupa password
router.get('/api/forgot-password/:username', forgotPassword);

//Get

// Rute mendapatkan user info berdsarkan ID
router.get('/api/user/id/:userId', getUserInfoById);

// Rute untuk mendapatkan produk berdasarkan kategori
router.get('/api/product/category/:categoryId', getProductByCategory);

// Rute untuk mendapatkan produk berdasarkan ID produk
router.get('/api/product/id/:productId', getProductById);

// Rute untuk mendapatkan produk berdasarkan ID brand
router.get('/api/product/brand/:brandId', getProductByBrand);

// Rute untuk mendapatkan merek berdasarkan ID brand
router.get('/api/brand/id/:brandId', getBrandById);

// Rute untuk mendapatkan pesanan berdasarkan ID pengguna
router.get('/api/order/user/:userId', getOrdersByUserId);

// Rute untuk mendapatkan pesanan berdasarkan ID pengguna
router.get('/api/order/id/:orderId', getOrdersById);

// Rute untuk mendapatkan merek (brands) berdasarkan ID pengguna
router.get('/api/brand/user/:userId', getBrandsByUserId);

// Rute untuk mendapatkan isi keranjang (cart) berdasarkan ID pengguna
router.get('/api/cart/user/:userId', getCartByUserId);

//Rute ubtuk mendapatkan review product
router.get('/api/review/product/:productId', getReviewsByProduct);

//Rute ubtuk mendapatkan review brand
router.get('/api/review/brand/:brandId', getReviewsByBrand);

//Add

// Rute untuk menambahkan user baru
router.post('/api/user/add',upload.single('user_image'), addUser);

// Rute untuk menambah produk baru
router.post('/api/product/add',upload.single('product_image'), addProduct);

// Rute untuk menambah brand baru
router.post('/api/brand/add',upload.single('brand_image'), addBrand);

// Rute untuk Menambahkan order baru
router.post('/api/order/add', addOrder);

// Rute untuk Menambahkan ke keranjang
router.post('/api/cart/add', addToCart);

// Rute untuk menambahkan review product
router.post('/api/review/add', addProductReview);

//Update

// Rute Update user_info berdasarkan ID
router.put('/api/user/update/:userId', upload.single('user_image'), updateUserById);

// Rute untuk memperbarui produk berdasarkan ID produk
router.put('/api/product/update/:productId',upload.single('product_image'), updateProductById);

// Rute untuk memperbarui pesanan berdasarkan ID pesanan
router.put('/api/order/update/:orderId', updateOrderById);

// Rute untuk mengupdate item di keranjang berdasarkan Cart ID
router.put('/api/cart/update/:cartId', updateCartById);

// Rute untuk memperbarui review product berdasarkan ID
router.put('/api/review/update/:reviewId', updateProductReviewById);

// Rute Update brand berdasarkan ID
router.put('/api/brand/update/:brandId',upload.single('brand_image'), updateBrandById);

//Delete

// Rute untuk menghapus user_info berdasarkan ID
router.delete('/api/user/delete/:userId', deleteUserById);

// Rute untuk menghapus produk berdasarkan ID produk
router.delete('/api/product/delete/:productId', deleteProductById);

// Rute untuk menghapus pesanan berdasarkan ID pesanan
router.delete('/api/order/delete/:orderId', deleteOrderById);

// Rute untuk menghapus item di keranjang berdasarkan Cart ID
router.delete('/api/cart/delete/:cartId', deleteCartById);

// Rute untuk menghapus review product berdasarkan ID
router.delete('/api/review/delete/:reviewId', deleteProductReviewById);

// Rute untuk menghapus brand berdasarkan ID
router.delete('/api/brand/delete/:brandId', deleteBrandById);

module.exports = router;
