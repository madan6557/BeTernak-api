const express = require('express');
const res = require('express/lib/response');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const EventEmitter = require('events');

const port = 3000;
const routes = require('./routes');

// Middleware untuk mengizinkan parsing JSON
app.use(bodyParser.json());

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
