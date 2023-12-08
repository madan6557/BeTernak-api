// test/test-connection.js
const db = require('../src/db.js');

// Tes koneksi
db.query('SELECT 1 + 1 as result', (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
    return;
  }
  
  console.log('Result:', results[0].result);
  
  // Tutup koneksi setelah pengujian
  db.end((endErr) => {
    if (endErr) {
      console.error('Error closing connection:', endErr);
    } else {
      console.log('Connection closed');
    }
  });
});
