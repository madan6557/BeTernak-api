// mlConnection.js
const axios = require('axios');

const predictUsingMLModel = async (inputData) => {
  try {
    const response = await axios.post('YOUR_CLOUD_RUN_MODEL_ENDPOINT', inputData);
    return response.data;
  } catch (error) {
    console.error('Error predicting using ML model:', error);
    throw error;
  }
};

module.exports = {
  predictUsingMLModel,
};