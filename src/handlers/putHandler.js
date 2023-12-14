const db = require('../db.js')
const { uploadToGCS,} = require('../gcs');

const updateUserById = async (req, res) => {
    const userId = req.params.userId;
    const updatedUserInfo = req.body;
  
    try {
      // Cek apakah ada berkas gambar yang disertakan
      if (req.file && req.file.buffer) {
        const imageBuffer = req.file.buffer;
        const contentType = req.file.mimetype;
  
        // Menyimpan gambar ke folder 'user-images'
        const filename = Date.now()+'_'+req.file.originalname
        const imageUrl = await uploadToGCS(
          imageBuffer,
          `user-images/${filename}`,
          contentType
        );
        updatedUserInfo.user_image = filename;
      }
  
      // Lakukan pembaruan ke database
      const query = 'UPDATE user_info SET ? WHERE user_id = ?';
  
      db.query(query, [updatedUserInfo, userId], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        res.status(200).json({ message: 'Update user details succes!' });
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const updateProductById = async (req, res) => {
    const productId = req.params.productId
    const updatedProduct = req.body
  
    try {
      // Cek apakah ada berkas gambar yang disertakan
      if (req.file && req.file.buffer) {
        const imageBuffer = req.file.buffer
        const contentType = req.file.mimetype
  
        // Menyimpan gambar ke folder 'product-images'
        const filename = Date.now()+'_'+req.file.originalname
        const imageUrl = await uploadToGCS(
          imageBuffer,
          `product-images/${filename}`,
          contentType,
        )
          updatedProduct.product_image = filename   
      }
  
      const updateQuery = 'UPDATE products SET ? WHERE product_id = ?'
  
      db.query(updateQuery, [updatedProduct, productId], (err, results) => {
        if (err) {
          console.error('Error executing query:', err)
          res.status(500).json({ error: 'Internal Server Error' })
          return
        }
  
        res.status(200).json({ message: 'Product updated successfully!' })
      })
    } catch (error) {
      console.error('Error updating product:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
  
  const updateOrderById = (req, res) => {
    const orderId = req.params.orderId
    const updatedOrder = req.body
  
    const updateQuery = 'UPDATE orders SET ? WHERE order_id = ?'
  
    db.query(updateQuery, [updatedOrder, orderId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
        return
      }
  
      res.status(200).json({ message: 'Order updated successfully!' })
    })
  }
  
  const updateCartById = (req, res) => {
    const cartId = req.params.cartId
    const updatedCartItem = req.body
  
    const query = 'UPDATE cart SET ? WHERE cart_id = ?'
  
    db.query(query, [updatedCartItem, cartId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
        return
      }
  
      res.status(200).json({ message: 'Cart updated successfully!' })
    })
  }
  
  const updateProductReviewById = (req, res) => {
    const reviewId = req.params.reviewId
    const updatedReviewData = req.body
  
    const query = 'UPDATE review SET ? WHERE review_id = ?'
  
    db.query(query, [updatedReviewData, reviewId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
        return
      }
  
      res.json({ message: 'Review updated successfully!' })
    })
  }
  
  const updateBrandById = async (req, res) => {
    const brandId = req.params.brandId
    const updatedBrandInfo = req.body
  
    try {
      // Cek apakah ada berkas gambar yang disertakan
      if (req.file && req.file.buffer) {
        const imageBuffer = req.file.buffer
        const contentType = req.file.mimetype
  
        // Menyimpan gambar ke folder 'brand-images'
        const filename = Date.now()+'_'+req.file.originalname
        const imageUrl = await uploadToGCS(
          imageBuffer,
          `brand-images/${filename}`,
          contentType,
        )
  
        updatedBrandInfo.brand_image = filename
      }
  
      const query = 'UPDATE brands SET ? WHERE brand_id = ?'
  
      db.query(query, [updatedBrandInfo, brandId], (err, results) => {
        if (err) {
          console.error('Error executing query:', err)
          res.status(500).json({ error: 'Internal Server Error' })
          return
        }
  
        res.status(200).json({ message: 'Brand informations update successfully' })
      })
    } catch (error) {
      console.error('Error updating brand:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  module.exports = {
    updateUserById,
    updateProductById,
    updateOrderById,
    updateCartById,
    updateProductReviewById,
    updateBrandById,
  }
  