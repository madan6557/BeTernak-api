const express = require('express');
const app = express();
const morgan = require('morgan');

const port = 3000;
const routes = require('./routes');

// Middleware untuk mengizinkan parsing JSON
app.use(express.json());

app.use(morgan('tiny'));

// Gunakan rute yang telah didefinisikan
app.use('/', routes);

// Middleware untuk mengizinkan CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Mulai server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
