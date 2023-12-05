// src/db.js
const mysql = require('mysql');

// Konfigurasi koneksi ke Cloud SQL
const connection = mysql.createConnection({
  host: 'EXTERNAL_IP',
  user: 'user',
  password: 'your-cloud-sql-password',
  database: 'your-database-name',
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
