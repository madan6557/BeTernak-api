const mysql = require('mysql');

// Konfigurasi koneksi ke Cloud SQL
const connection = mysql.createConnection({
  host: '34.128.97.242', // IP external Cloud SQL
  user: 'root', // Ganti dengan nama pengguna database
  password: 'admin', // Ganti dengan kata sandi database
  database: 'db_beternakapp', // Ganti dengan nama database
});

// Buka koneksi
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to Cloud SQL:', err);
    return;
  }
  console.log('Connected to Cloud SQL');
});

module.exports = connection; 
 