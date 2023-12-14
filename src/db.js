const mysql = require('mysql2');

// Konfigurasi koneksi ke Cloud SQL
const connection = mysql.createConnection({
  host: 'localhost', //tidak perlu mengubah ini karena akan diabaikan di Google Cloud SQL
  user: 'root', // Ganti dengan nama pengguna database
  password: '', // Ganti dengan kata sandi database
  database: 'db_beternakapp', // Ganti dengan nama database
  socketPath: '/cloudsql/your-project-id:your-instance-name', // Ganti dengan path socket Cloud SQL
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
