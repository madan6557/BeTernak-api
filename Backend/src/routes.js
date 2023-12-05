// src/routes.js
const express = require('express');
const router = express.Router();
const {
  getHandler,
  postHandler,
  putHandler,
  deleteHandler,
  uploadHandler,
  downloadHandler,
} = require('./handler');

// Rute untuk mendapatkan semua data
router.get('/api/data', getHandler);

// Rute untuk menambahkan data baru
router.post('/api/data', postHandler);

// Rute untuk memperbarui data
router.put('/api/data/:id', putHandler);

// Rute untuk menghapus data
router.delete('/api/data/:id', deleteHandler);

// Rute untuk mengunggah file
router.post('/api/upload', uploadHandler);

// Rute untuk mengunduh file
router.get('/api/download/:folder/:fileName', downloadHandler);

module.exports = router;
