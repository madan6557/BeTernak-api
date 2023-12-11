const db = require('../db.js')
const { uploadToGCS} = require('../gcs');

const addUser = async (req, res) => {
    const newUser = req.body
    const query = 'INSERT INTO user_info SET ?'
  
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
  
      newUser.imageFileName = filename;
    }
  
  
    db.query(query, newUser, (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
        return
      }
  
      res.json({
        message: 'User baru berhasil ditambahkan',
        userId: results.insertId,
      })
    })
  }
  
  const addProduct = async (req, res) => {
    const product = req.body
  
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
        product.product_image = filename
  
      }
  
      const query = 'INSERT INTO products SET ?'
      product.product_id = null
  
      db.query(query, product, (err, results) => {
        if (err) {
          console.error('Error executing query:', err)
          res.status(500).json({ error: 'Internal Server Error' })
          return
        }
  
        res.json({ message: 'Produk berhasil ditambahkan' })
      })
    } catch (error) {
      console.error('Error adding product:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
  
  const addBrand = async (req, res) => {
    const brandData = req.body
  
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
  
        brandData.brand_image = filename
  
      }
  
      const query = 'INSERT INTO brands SET ?'
  
      db.query(query, brandData, (err, results) => {
        if (err) {
          console.error('Error executing query:', err)
          res.status(500).json({ error: 'Internal Server Error' })
          return
        }
  
        res.json({
          message: 'Merek baru berhasil ditambahkan',
          brandId: results.insertId,
        })
      })
    } catch (error) {
      console.error('Error adding brand:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
  
  const addOrder = async (req, res) => {
    try {
      const order = req.body
  
      const query = 'INSERT INTO orders SET ?'
  
      db.query(query, order, (err, results) => {
        if (err) {
          console.error('Error executing query:', err)
          res.status(500).json({ error: 'Internal Server Error' })
          return
        }
  
        res.json({ message: 'Order berhasil ditambahkan' })
      })
    } catch (error) {
      console.error('Error adding order:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
  
  const addToCart = (req, res) => {
    const cartItem = req.body
  
    const query = 'INSERT INTO cart SET ?'
  
    db.query(query, cartItem, (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
        return
      }
  
      res.json({ message: 'Item berhasil dimasukkan ke keranjang' })
    })
  }
  
  const addProductReview = (req, res) => {
    const reviewData = req.body
  
    const query = 'INSERT INTO review SET ?'
  
    db.query(query, reviewData, (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
        return
      }
  
      res.json({ message: 'Review berhasil ditambahkan' })
    })
  }

  module.exports = {
    addUser,
    addProduct,
    addBrand,
    addOrder,
    addToCart,
    addProductReview,
  }