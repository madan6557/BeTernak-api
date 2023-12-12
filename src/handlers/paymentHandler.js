// handler/paymentHandler.js
const axios = require("axios");
const { MidtransClient } = require("midtrans-client");
const db = require("../db");

const midtransClient = new MidtransClient({
  isProduction: false,
  serverKey: "SB-Mid-server-EoA5hBabN-TqLI0j8LQVEbXt",
  clientKey: "SB-Mid-client-YG8DwhYhczEsayT4",
});

const createPayment = async (req, res) => {
    const { userId, productId, quantity } = req.body;
  
    db.connect();
  
    // Ambil data pengguna dari tabel user_info
    const userInfo = await db.query(
      'SELECT first_name, last_name, email, address1 FROM user_info WHERE user_id = ?',
      [userId]
    );
  
    if (userInfo.length === 0) {
      res.status(404).json({ error: 'User not found' });
      db.end();
      return;
    }
  
    const firstName = userInfo[0].first_name;
    const lastName = userInfo[0].last_name;
    const email = userInfo[0].email;
    const address = userInfo[0].address1;
  
    // Ambil data tambahan dari database berdasarkan input pengguna
  const productInfo = await db.query(
    "SELECT product_name, product_price FROM products WHERE product_id = ?",
    [productId]
  );

  if (productInfo.length === 0) {
    res.status(404).json({ error: "Product not found" });
    db.end();
    return;
  }

  const productName = productInfo[0].product_name;
  const productPrice = productInfo[0].product_price;

    db.query(
      'INSERT INTO orders (user_id, product_id, qty, p_status) VALUES (?, ?, ?, ?)',
      [userId, productId, quantity, 'pending'],
      async (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        const orderId = result.insertId;
  
        // Buat transaksi di Midtrans menggunakan Snap API
        const transactionDetails = {
          orderId: `ORDER-${orderId}`,
          grossAmount: productPrice * quantity, // Sesuaikan dengan jumlah yang sesuai dengan aplikasi Anda
        };
  
        try {
          const parameter = {
            transaction_details: transactionDetails,
            credit_card: {
              secure: true,
            },
            item_details: [
              {
                id: productId,
                price: productPrice,
                quantity: quantity,
                name: productName, 
              },
            ],
            customer_details: {
              email: email,              
              first_name: firstName,
              last_name: lastName,
              billing_address: {
                address: address,                
              },
            },
          };
  
          Snap.createTransaction(parameter)
            .then((transaction) => {
              // transaction token
              let transactionToken = transaction.token;
              console.log('transactionToken:', transactionToken);
  
              // Update transfer_id di database
              db.query(
                'UPDATE orders SET transfer_id = ? WHERE order_id = ?',
                [transactionToken, orderId],
                () => {
                  res.json({ transactionToken });
                }
              );
            })
            .catch((error) => {
              console.error(error);
              res.status(500).json({ error: 'Midtrans API Error' });
            });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Midtrans API Error' });
        } finally {
          db.end();
        }
      }
    );
  };
  
  const completePayment = (req, res) => {
    const { orderId } = req.body;
  
    // Perbarui status transaksi di database
    db.connect();
  
    db.query(
      'UPDATE orders SET p_status = ? WHERE order_id = ?',
      ['completed', orderId],
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        res.json({ status: 'Payment completed successfully' });
  
        db.end();
      }
    );
  };
  
  module.exports = {
    createPayment,
    completePayment,
  };
