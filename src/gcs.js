const { Storage } = require('@google-cloud/storage');
const path = require('path');

const keyFilePath = path.join(__dirname, '../key/credentials.js');
const storage = new Storage({
  keyFilename: keyFilePath,
});

// Gantilah 'your-bucket-name' dengan nama bucket GCS Anda
const bucket = storage.bucket('your-bucket-name');

const uploadToGCS = (fileBuffer, destination, contentType) => {
  const file = bucket.file(destination);

  const stream = file.createWriteStream({
    metadata: {
      contentType: contentType,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve(`gs://${bucket.name}/${file.name}`);
    });

    stream.on('error', (err) => {
      reject(err);
    });

    stream.end(fileBuffer);
  });
};

module.exports = {
  uploadToGCS,
};
