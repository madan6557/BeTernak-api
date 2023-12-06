const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'your-project-id', 
  keyFilename: 'path/to/your/keyfile.json',
});

module.exports = storage;
