const db = require('../db.js')
const mlConnection = require('../mlConnection')
const { uploadToGCS, bucketName } = require('../gcs');

const getPrediction = async (req, res) => {
    // Contoh penggunaan model machine learning
    const inputData = req.body.data
    const prediction = await mlConnection.predictUsingMLModel(inputData)
  
    // Lakukan sesuatu dengan hasil prediksi
    res.json({ prediction })
  }

  module.exports = {
    getPrediction,
  }