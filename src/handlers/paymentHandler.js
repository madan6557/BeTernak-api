// handler/paymentHandler.js
const midtransClient = require("midtrans-client");
const db = require("../db");

let snapClient = new midtransClient.Snap({
  isProduction: false,
  serverKey: "SB-Mid-server-EoA5hBabN-TqLI0j8LQVEbXt",
  // clientKey: "SB-Mid-client-YG8DwhYhczEsayT4",
});

const createPayment = async (req, res) => {
  const { quantity, productId, userId } = req.body; // Menggunakan object destructuring untuk mengambil quantity dari req.body
  let productInfo;

  try {
    const query = "SELECT * FROM products WHERE product_id = ?";
    productInfo = await db.query(query, [productId]);

    // Ensure that productInfo is an array or an object
    let productTitle, productPrice;

    if (!Array.isArray(productInfo)) {
      // Assuming productInfo is an object
      if (!productInfo[0]) {
        res.status(404).json({ error: "Product not fod" });
        return;
      }

      productTitle = productInfo.product_title;
      productPrice = productInfo.product_price;
    } else {
      // Assuming productInfo is an array
      if (productInfo.length === 0) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      const firstProduct = productInfo;
      productTitle = firstProduct.product_title;
      productPrice = firstProduct.product_price;
    }

    // Call the function now that it's defined
    createTransactionAndRespond(
      res,
      userId,
      productId,
      quantity,
      productTitle,
      productPrice
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Tidak perlu db.end() karena Anda ingin menjaga koneksi terbuka untuk transaksi selanjutnya
  }
};

const createTransactionAndRespond = (
  res,
  userId,
  productId,
  quantity,
  productTitle,
  productPrice
) => {
  db.query(
    "INSERT IGNORE INTO orders (user_id, product_id, qty, p_status) VALUES (?, ?, ?, ?)",
    [userId, productId, quantity, "pending"],
    async (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      const orderId = result.insertId;

      // Buat transaksi di Midtrans menggunakan Snap API
      const transactionDetails = {
        orderId: `ORDER-${orderId}`,
        grossAmount: productPrice * quantity,
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
              name: productTitle,
            },
          ],
        };

        snapClient
          .createTransaction(parameter)
          .then((transaction) => {
            // transaction token
            let transactionToken = transaction.token;
            console.log("transactionToken:", transactionToken);

            // Update transfer_id di database
            db.query(
              "UPDATE orders SET transfer_id = ? WHERE order_id = ?",
              [transactionToken, orderId],
              () => {
                res.json({ transactionToken });
              }
            );
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Midtrans API Error" });
          });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Midtrans API Error" });
      }
    }
  );
};

const completePayment = (req, res) => {
  const { orderId } = req.body;

  // Perbarui status transaksi di database
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
    }
  );
};

module.exports = {
  createPayment,
  completePayment,
};
