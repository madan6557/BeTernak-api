// src/db.js
const mysql = require('mysql');

// Konfigurasi koneksi ke Cloud SQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_beternakapp',
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
