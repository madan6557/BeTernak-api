const db = require('./db.js')
const mlConnection = require('./mlConnection')
const { uploadToGCS, bucketName } = require('./gcs');

const getGCSImageUrl = (folder, imageName) => {
  try {
    // Coba mendapatkan URL gambar dari GCS
    return `https://storage.googleapis.com/${bucketName}/${folder}/${imageName}`
  } catch (error) {
    console.error('Error getting GCS image URL:', error)
    // Jika terjadi kesalahan, kembalikan string kosong atau sesuai kebutuhan
    return ''
  }
}

const getUserInfoById = (req, res) => {
  const userId = req.params.userId
  const query = 'SELECT * FROM user_info WHERE user_id = ?'

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const usersWithImageUrl = results.map((user) => {
      return {
        ...user,
        user_image: getGCSImageUrl('user-images', user.user_image),
      };
    });
    res.json({ data: usersWithImageUrl })
  })
}

const getProductByCategory = (req, res) => {
  const categoryId = req.params.categoryId
  const query = 'SELECT * FROM products WHERE product_cat = ?'

  db.query(query, categoryId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    const productsWithImageUrl = results.map((product) => {
      return {
        ...product,
        product_image: getGCSImageUrl('product-images', product.product_image),
      }
    })

    res.json({ data: productsWithImageUrl })
  })
}

const getProductById = (req, res) => {
  const productId = req.params.productId
  const query = 'SELECT * FROM products WHERE product_id = ?'

  db.query(query, productId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    const productsWithImageUrl = results.map((product) => {
      return {
        ...product,
        product_image: getGCSImageUrl('product-images', product.product_image),
      }
    })

    res.json({ data: productsWithImageUrl })
  })
}

const getProductByBrand = (req, res) => {
  const brandId = req.params.brandId
  const query = 'SELECT * FROM products WHERE product_brand = ?'

  db.query(query, brandId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    const productsWithImageUrl = results.map((product) => {
      return {
        ...product,
        product_image: getGCSImageUrl('product-images', product.product_image),
      }
    })

    res.json({ data: productsWithImageUrl })
  })
}

const getBrandById = (req, res) => {
  const brandId = req.params.brandId
  const query = 'SELECT * FROM brands WHERE brand_id = ?'

  db.query(query, brandId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Brand not found' })
      return
    }

    const brandsWithImageUrl = results.map((brand) => {
      return {
        ...brand,
        brand_image: getGCSImageUrl('brand-images', brand.brand_image),
      }
    })

    res.json({ data: brandsWithImageUrl })
  })
}

const getOrdersByUserId = (req, res) => {
  const userId = req.params.userId
  const query = `
  SELECT
    orders.*,
    user_info.first_name,
    user_info.last_name,
    user_info.no_rek,
    products.product_price AS satuan,
    products.product_price * orders.qty AS total
  FROM orders
  INNER JOIN user_info ON orders.user_id = user_info.user_id
  INNER JOIN products ON orders.product_id = products.product_id
  WHERE orders.user_id = ?;
`

  db.query(query, userId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Order not found' })
      return
    }

    res.json({ data: results })
  })
}

const getOrdersById = (req, res) => {
  const orderId = req.params.orderId
  const query = `
  SELECT
    orders.*,
    user_info.first_name,
    user_info.last_name,
    user_info.no_rek,
    products.product_price AS satuan,
    products.product_price * orders.qty AS total
  FROM orders
  INNER JOIN user_info ON orders.user_id = user_info.user_id
  INNER JOIN products ON orders.product_id = products.product_id
  WHERE orders.order_id = ?;
`

  db.query(query, orderId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Order not found' })
      return
    }

    res.json({ data: results })
  })
}

const getBrandsByUserId = (req, res) => {
  const userId = req.params.userId
  const query = `
    SELECT brands.*, user_info.first_name, user_info.last_name
    FROM brands
    INNER JOIN user_info ON brands.user_id = user_info.user_id
    WHERE brands.user_id = ?
  `

  db.query(query, userId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Brand not found' })
      return
    }

    res.json({ data: results })
  })
}

const getCartByUserId = (req, res) => {
  const userId = req.params.userId
  const query = `
    SELECT cart.*, user_info.first_name, user_info.last_name
    FROM cart
    INNER JOIN user_info ON cart.user_id = user_info.user_id
    WHERE cart.user_id = ?
  `

  db.query(query, userId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Cart not found' })
      return
    }

    const productsWithImageUrl = results.map((product) => {
      return {
        ...product,
        product_image: getGCSImageUrl('product-images', product.product_image),
      }
    })

    res.json({ data: productsWithImageUrl })
  })
}

const getReviewsByProduct = (req, res) => {
  const productId = req.params.productId
  const query = 'SELECT * FROM review WHERE product_id = ?'

  db.query(query, productId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Reviews not found' })
      return
    }

    res.json({ data: results })
  })
}

const getReviewsByBrand = (req, res) => {
  const brandId = req.params.brandId
  const query = 'SELECT * FROM review WHERE brand_id = ?'

  db.query(query, brandId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Reviews not found' })
      return
    }

    res.json({ data: results })
  })
}



//add



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


//update




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

      res.json({ message: 'Mengupdate informasi user berhasil' });
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

      res.json({ message: 'Produk berhasil diperbarui' })
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

    res.json({ message: 'Pesanan berhasil diperbarui' })
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

    res.json({ message: 'Item di keranjang berhasil diupdate' })
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

    res.json({ message: 'Review product berhasil diperbarui' })
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

      res.json({ message: 'Mengupdate informasi brand berhasil' })
    })
  } catch (error) {
    console.error('Error updating brand:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}



//delete



const deleteUserById = (req, res) => {
  const userId = req.params.userId

  const query = 'DELETE FROM user_info WHERE user_id = ?'

  db.query(query, userId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    res.json({ message: 'User berhasil dihapus' })
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

    res.json({ message: 'Produk berhasil dihapus' })
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

    res.json({ message: 'Pesanan berhasil dihapus' })
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

    res.json({ message: 'Keranjang berhasil dihapus' })
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

    res.json({ message: 'Reviews berhasil dihapus' })
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

    res.json({ message: 'Brand berhasil dihapus' })
  })
}

const getPrediction = async (req, res) => {
  // Contoh penggunaan model machine learning
  const inputData = req.body.data
  const prediction = await mlConnection.predictUsingMLModel(inputData)

  // Lakukan sesuatu dengan hasil prediksi
  res.json({ prediction })
}

module.exports = {
  getUserInfoById,
  getProductByCategory,
  getProductById,
  getProductByBrand,
  addUser,
  addProduct,
  addBrand,
  addOrder,
  addToCart,
  addProductReview,
  getOrdersByUserId,
  getOrdersById,
  getBrandsByUserId,
  getCartByUserId,
  getReviewsByProduct,
  getReviewsByBrand,
  getBrandById,
  getPrediction,
  updateUserById,
  updateProductById,
  updateOrderById,
  updateCartById,
  updateProductReviewById,
  updateBrandById,
  deleteUserById,
  deleteProductById,
  deleteOrderById,
  deleteCartById,
  deleteProductReviewById,
  deleteBrandById,
}
