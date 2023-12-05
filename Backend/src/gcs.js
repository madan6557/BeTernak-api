// src/gcs.js
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'your-project-id', // Ganti dengan ID proyek Google Cloud Anda
  keyFilename: 'path/to/your/keyfile.json', // Ganti dengan path ke file kunci JSON GCP Anda
});

module.exports = storage;
