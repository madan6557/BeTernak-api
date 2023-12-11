const db = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const newUser = req.body;

    // Periksa apakah username sudah ada dalam database
    const checkUsernameQuery = 'SELECT * FROM user_info WHERE username = ?';
    db.query(checkUsernameQuery, [newUser.username], async (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error checking username:', checkErr);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Jika username sudah ada, kirim respons konflik
      if (checkResults.length > 0) {
        res.status(409).json({ error: 'Username already exists' });
        return;
      }

      // Hash kata sandi sebelum menyimpan ke database
      const hashedPassword = await bcrypt.hash(newUser.password, 10);

      // Simpan data pengguna baru ke database
      const insertUserQuery = 'INSERT INTO user_info SET ?';
      db.query(insertUserQuery, [{ ...newUser, password: hashedPassword }], (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        res.status(200).json({
          message: 'Register succes!',
          userId: results.insertId,
        });
      });
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const userLog = req.body;
    const query = 'SELECT * FROM user_info WHERE username = ?';

    db.query(query, [userLog.username], async (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Pastikan result adalah array yang tidak kosong
      const user = result && result.length > 0 ? result[0] : null;

      if (user) {
        // Verifikasi kata sandi
        const passwordMatch = await bcrypt.compare(userLog.password, user.password);

        if (passwordMatch) {
          // Buat token JWT sebagai tanda otentikasi
          const token = jwt.sign({ userId: user.user_id, username: user.username }, 'secret_key', { expiresIn: '1h' });

          res.status(200).json({ message: 'Log in succes!', token });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fungsi untuk menghasilkan kata sandi acak
const generateRandomPassword = () => {
  // Implementasi logika pembuatan kata sandi acak di sini
  // Contoh: Menghasilkan kata sandi acak dengan panjang 8 karakter
  const randomPassword = Math.random().toString(36).slice(-8);
  return randomPassword;
};

// Fungsi untuk mengupdate kata sandi pengguna di database
const updatePasswordInDatabase = async (username, newPassword) => {
  try {
    // Menghasilkan kata sandi acak baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Implementasi logika update kata sandi di database
    const query = 'UPDATE user_info SET password = ? WHERE username = ?';
    await db.query(query, [hashedPassword, username]);

    return true; // Berhasil mengupdate kata sandi
  } catch (error) {
    console.error('Error updating password in database:', error);
    throw error; // Gagal mengupdate kata sandi
  }
};

const forgotPassword = async (req, res) => {
  try {
    // Mendapatkan data pengguna dari request, misalnya, username
    const user = req.body;

    // Menghasilkan kata sandi acak baru
    const newPassword = generateRandomPassword();

    // Mengupdate kata sandi pengguna di database
    const updateSuccess = await updatePasswordInDatabase(user.username, newPassword);

    if (updateSuccess) {
      // Kirim respons berhasil dan kata sandi baru ke frontend
      res.status(200).json({ message: 'New password sent successfully', newPassword });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error sending new password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = { register, login, forgotPassword };
