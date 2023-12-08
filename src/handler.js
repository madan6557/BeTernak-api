const db = require('./db.js');
const mlConnection = require('./mlConnection')
const { uploadToGCS } = require('./gcs');

const getGCSImageUrl = (imageName) => {
  try {
    // Coba mendapatkan URL gambar dari GCS
    return `https://storage.googleapis.com/${bucketName}/${imageName}`;
  } catch (error) {
    console.error('Error getting GCS image URL:', error);
    // Jika terjadi kesalahan, kembalikan string kosong atau sesuai kebutuhan
    return '';
  }
};

const getUserInfoById = (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM user_info WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ data: results[0] });
  });
};

const getProductByCategory = (req, res) => {
  const categoryId = req.params.categoryId;
  const query = 'SELECT * FROM products WHERE product_cat = ?';

  db.query(query, categoryId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const productsWithImageUrl = results.map(product => {
      return {
        ...product,
        product_image: getGCSImageUrl('product-images', product.product_image),
      };
    });

    res.json({ data: productsWithImageUrl });
  });
};

const getProductById = (req, res) => {
  const productId = req.params.productId;
  const query = 'SELECT * FROM products WHERE product_id = ?';

  db.query(query, productId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const productsWithImageUrl = results.map(product => {
      return {
        ...product,
        product_image: getGCSImageUrl('product-images', product.product_image),
      };
    });

    res.json({ data: productsWithImageUrl });
  });
};

const getProductByBrand = (req, res) => {
  const brandId = req.params.brandId;
  const query = 'SELECT * FROM products WHERE product_brand = ?';

  db.query(query, brandId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const productsWithImageUrl = results.map(product => {
      return {
        ...product,
        product_image: getGCSImageUrl('product-images', product.product_image),
      };
    });

    res.json({ data: productsWithImageUrl });
  });
};

const getOrdersByUserId = (req, res) => {
  const userId = req.params.userId;
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
`;

  db.query(query, userId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ data: results });
  });
};

const getOrdersById = (req, res) => {
  const orderId = req.params.orderId;
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
`;

  db.query(query, orderId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ data: results });
  });
};

const getBrandsByUserId = (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT brands.*, user_info.first_name, user_info.last_name
    FROM brands
    INNER JOIN user_info ON brands.user_id = user_info.user_id
    WHERE brands.user_id = ?
  `;

  db.query(query, userId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ data: results });
  });
};

const getCartByUserId = (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT cart.*, user_info.first_name, user_info.last_name
    FROM cart
    INNER JOIN user_info ON cart.user_id = user_info.user_id
    WHERE cart.user_id = ?
  `;

  db.query(query, userId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const productsWithImageUrl = results.map(product => {
      return {
        ...product,
        product_image: getGCSImageUrl('product-images', product.product_image),
      };
    });

    res.json({ data: productsWithImageUrl });
  });
};

const getReviewsByProduct = (req, res) => {
  const productId = req.params.productId;
  const query = 'SELECT * FROM review WHERE product_id = ?';

  db.query(query, productId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ data: results });
  });
};

const getReviewsByBrand = (req, res) => {
  const brandId = req.params.brandId;
  const query = 'SELECT * FROM review WHERE brand_id = ?';

  db.query(query, brandId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ data: results });
  });
};

const addUser = (req, res) => {
  const newUser = req.body;
  const query = 'INSERT INTO user_info SET ?';

  db.query(query, newUser, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'User baru berhasil ditambahkan', userId: results.insertId });
  });
};

const addProduct = async (req, res) => {
  const product = req.body;

  try {
    // Cek apakah ada berkas gambar yang disertakan
    if (req.file && req.file.buffer) {
      const imageBuffer = req.file.buffer;
      const contentType = req.file.mimetype;

      // Menyimpan gambar ke folder 'product_images'
      const imageUrl = await uploadToGCS(
        imageBuffer,
        `product_images/${Date.now()}_${req.file.originalname}`,
        contentType
      );

      product.product_image = imageUrl;
    }

    const query = 'INSERT INTO products SET ?';
    product.product_id = null;

    db.query(query, product, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json({ message: 'Produk berhasil ditambahkan' });
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addOrder = async (req, res) => {
  try {
    const order = req.body;

    const query = 'INSERT INTO orders SET ?';

    db.query(query, order, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json({ message: 'Order berhasil ditambahkan' });
    });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addToCart = (req, res) => {
  const cartItem = req.body; 

  const query = 'INSERT INTO cart SET ?';

  db.query(query, cartItem, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'Item berhasil dimasukkan ke keranjang' });
  });
};

const updateUserById = (req, res) => {
  const userId = req.params.userId;
  const updatedUserInfo = req.body; 

  const query = 'UPDATE user_info SET ? WHERE user_id = ?';

  db.query(query, [updatedUserInfo, userId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'Mengupdate informasi user berhasil' });
  });
};


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
  addOrder,
  addToCart,
  getOrdersByUserId,
  getOrdersById,
  getBrandsByUserId,
  getCartByUserId,
  getReviewsByProduct,
  getReviewsByBrand,
  getPrediction,
  updateUserById,
};
