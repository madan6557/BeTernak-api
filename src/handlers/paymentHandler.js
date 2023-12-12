// handler/paymentHandler.js
const axios = require("axios");
const { MidtransClient } = require("midtrans-client");
const db = require("../db");

const midtransClient = new MidtransClient({
  isProduction: false,
  serverKey: "SB-Mid-server-EoA5hBabN-TqLI0j8LQVEbXt",
  clientKey: "SB-Mid-client-YG8DwhYhczEsayT4",
});

const createAndPaymentURL = async (req, res) => {
  const { userId, productId, qty } = req.body;

  db.connect();

  // Ambil data pengguna dari tabel user_info
  const userInfo = await db.query(
    "SELECT first_name, last_name, email, address1 FROM user_info WHERE user_id = ?",
    [userId]
  );

  if (userInfo.length === 0) {
    res.status(404).json({ error: "User not found" });
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
    "INSERT INTO orders (user_id, product_id, qty, p_status) VALUES (?, ?, ?, ?)",
    [userId, productId, quantity, "pending"],
    async (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      const orderId = result.insertId;

      // Buat transaksi di Midtrans
      const transactionDetails = {
        orderId: `ORDER-${orderId}`,
        grossAmount: productPrice * qty, // Sesuaikan dengan jumlah yang sesuai dengan produk
      };

      try {
        const response = await midtransClient.transaction.charge({
          payment_type: "bank_transfer",
          transaction_details: transactionDetails,
        });

        const paymentToken = response.token;

        // Update transfer_id di database
        await db.query("UPDATE orders SET transfer_id = ? WHERE order_id = ?", [
          paymentToken,
          orderId,
        ]);

        // Dapatkan URL pembayaran dari Midtrans Snap
        const snapResponse = await axios.post(
          "https://api.sandbox.midtrans.com/v2/snap/v1/transactions",
          {
            transaction_details: {
              order_id: `ORDER-${orderId}`,
              gross_amount: productPrice * qty, // Sesuaikan dengan jumlah yang sesuai dengan produk
            },
            credit_card: {
              secure: true,
            },
            item_details: [
              {
                id: productId,
                price: productPrice,
                quantity: qty,
                name: productName,
              },
            ],
            customer_details: {
              email: email, // Sesuaikan dengan data pengguna
              first_name: firstName, // Sesuaikan dengan data pengguna
              last_name: lastName,
              billing_address: {
                address: address,
              }, // Sesuaikan dengan data pengguna
            },
          },
          {
            headers: {
              Authorization: `Basic ${Buffer.from(
                "YOUR_MIDTRANS_SERVER_KEY" + ":"
              ).toString("base64")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const paymentURL = snapResponse.data.redirect_url;
        res.json({ paymentToken, paymentURL });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Midtrans API Error" });
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
    "UPDATE orders SET p_status = ? WHERE order_id = ?",
    ["completed", orderId],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json({ status: "Payment completed successfully" });

      db.end();
    }
  );
};

module.exports = {
  createAndPaymentURL,
  completePayment,
};
