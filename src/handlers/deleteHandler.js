const db = require('../db.js')
const mlConnection = require('../mlConnection')

const deleteUserById = (req, res) => {
    const userId = req.params.userId
  
    const query = 'DELETE FROM user_info WHERE user_id = ?'
  
    db.query(query, userId, (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
        return
      }
  
      res.status(200).json({ message: 'User deleted succesfully!' })
    })
  }
  
  const deleteProductById = (req, res) => {
    const productId = req.params.productId
  
    const query = 'DELETE FROM products WHERE product_id = ?'
  
    db.query(query, productId, (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
        return
      }
  
      res.status(200).json({ message:  'Product deleted successfully!' })
    })
  }
  
  const deleteOrderById = (req, res) => {
    const orderId = req.params.orderId
  
    const query = 'DELETE FROM orders WHERE order_id = ?'
  
    db.query(query, orderId, (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
        return
      }
  
      res.status(200).json({ message: 'Order deleted successfully!' })
    })
  }
  
  const deleteCartById = (req, res) => {
    const cartId = req.params.cartId
  
    const query = 'DELETE FROM cart WHERE cart_id = ?'
  
    db.query(query, cartId, (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
        return
      }
  
      res.json({ message: 'Cart deleted successfully!' })
    })
  }
  
  const deleteProductReviewById = (req, res) => {
    const reviewId = req.params.reviewId
  
    const query = 'DELETE FROM review WHERE review_id = ?'
  
    db.query(query, reviewId, (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
        return
      }
  
      res.json({ message: 'Review deleted successfully!' })
    })
  }
  
  const deleteBrandById = (req, res) => {
    const brandId = req.params.brandId
  
    const query = 'DELETE FROM brands WHERE brand_id = ?'
  
    db.query(query, brandId, (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
        return
      }
  
      res.status(200).json({ message: 'Brand deleted succesfully!' })
    })
  }

  module.exports = {
    deleteUserById,
    deleteProductById,
    deleteOrderById,
    deleteCartById,
    deleteProductReviewById,
    deleteBrandById,
  }