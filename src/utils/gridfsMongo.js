/* eslint-disable no-underscore-dangle */
const { createBucket } = require('mongoose-gridfs');
const fs = require('fs');

let bucket;

const init = () => {
  bucket = createBucket();
};

const uploadMongo = (filename, file, resolve) => {
  /* const symbols = Object.getOwnPropertySymbols(file._writeStream)
  const readStream = file._writeStream[symbols[0]].createReadStream(file.path) */
  const readStream = fs.createReadStream(file.path);
  bucket.writeFile({ filename }, readStream, (error, uploadedFile) => {
    resolve(error ? -1 : uploadedFile._id);
  });
};

const downloadMongo = (id) => {
  let downloaded;
  bucket.findById(id, (error, file) => {
    downloaded = error ? null : file;
  });
  return downloaded;
};

const deleteMongo = (id, resolve) => {
  bucket.deleteFile(id, (error, _id) => {
    resolve(error ? -1 : _id);
  });
};

module.exports = {
  bucket,
  init,
  uploadMongo,
  downloadMongo,
  deleteMongo,
};
