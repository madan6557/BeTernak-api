const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'project-id', 
  keyFilename: 'path/to/keyfile.json',
});

module.exports = storage;
