// src/handler.js
// const db = require('./db');
// const gcs = require('./gcs');
const mlConnection = require('./mlConnection');

const uploadToGCS = async (fileName, fileBuffer, folder) => {
  const bucket = gcs.bucket('gcs-bucket-name'); // Ganti dengan nama bucket GCS 
  const file = bucket.file(`${folder}/${fileName}`);
  await file.save(fileBuffer);
};

const downloadFromGCS = (fileName, folder) => {
  const bucket = gcs.bucket('gcs-bucket-name'); // Ganti dengan nama bucket GCS 
  const file = bucket.file(`${folder}/${fileName}`);
  return file.download();
};

const getPrediction = async (req, res) => {
    const inputData = req.body.data;
    const prediction = await mlConnection.predictUsingMLModel(inputData);

    res.json({ prediction });
  };
  

const getHandler = (req, res) => {
  const query = 'SELECT * FROM your_table_name';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    
    res.json({ data: results });
  });
}; 
  const postHandler = (req, res) => {
    // Proses data dari permintaan POST di sini
    res.json({ message: 'Data berhasil disimpan' });
  };
  
  const putHandler = (req, res) => {
    // Proses data dari permintaan PUT di sini
    res.json({ message: `Data dengan ID ${req.params.id} berhasil diperbarui` });
  };
  
  const deleteHandler = (req, res) => {
    // Proses data dari permintaan DELETE di sini
    res.json({ message: `Data dengan ID ${req.params.id} berhasil dihapus` });
  };
  const uploadHandler = async (req, res) => {
    const { fileName, fileBuffer, folder } = req.body;
  
    try {
      await uploadToGCS(fileName, fileBuffer, folder);
      res.json({ message: 'File berhasil diunggah ke GCS' });
    } catch (error) {
      console.error('Error uploading file to GCS:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const downloadHandler = async (req, res) => {
    const { fileName, folder } = req.params;
  
    try {
      const [fileBuffer] = await downloadFromGCS(fileName, folder);
      res.send(fileBuffer);
    } catch (error) {
      console.error('Error downloading file from GCS:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports = {
    getPrediction,
    getHandler,
    postHandler,
    putHandler,
    deleteHandler,
    uploadHandler,
    downloadHandler,
  };
  
