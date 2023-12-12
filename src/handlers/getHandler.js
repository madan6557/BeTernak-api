const db = require('../db.js')
const {bucketName } = require('../gcs');

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
    res.status(200).json({ data: usersWithImageUrl })
  })
}

const getUserRef = (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT  
      categories.cat_title, 
      animals1.animal_title AS animal_title_1, 
      animals2.animal_title AS animal_title_2
    FROM 
      user_info
    INNER JOIN 
      categories ON user_info.cat_id = categories.cat_id
    INNER JOIN 
      animals AS animals1 ON user_info.animal_id1 = animals1.animal_id
    INNER JOIN 
      animals AS animals2 ON user_info.animal_id2 = animals2.animal_id
    WHERE 
      user_info.user_id = ?`;

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
    
        res.status(200).json({ results })
      })
};


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

    res.status(200).json({ data: productsWithImageUrl })
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

    res.status(200).json({ data: productsWithImageUrl })
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

    res.status(200).json({ data: productsWithImageUrl })
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

    res.status(200).json({ data: brandsWithImageUrl })
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

    res.status(200).json({ data: results })
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

module.exports = {
    getUserInfoById,
    getUserRef,
    getProductByCategory,
    getProductById,
    getProductByBrand,
    getOrdersByUserId,
    getOrdersById,
    getBrandsByUserId,
    getCartByUserId,
    getReviewsByProduct,
    getReviewsByBrand,
    getBrandById,
  }
  