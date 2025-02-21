const multer = require('multer');
const storage = multer.diskStorage({});

// Nodejs进阶：基于express+multer的文件上传
// https://www.cnblogs.com/chyingp/p/express-multer-file-upload.html

// [筆記] 使用 Multer 實作大頭貼上傳
// https://medium.com/%E9%BA%A5%E5%85%8B%E7%9A%84%E5%8D%8A%E8%B7%AF%E5%87%BA%E5%AE%B6%E7%AD%86%E8%A8%98/%E7%AD%86%E8%A8%98-%E4%BD%BF%E7%94%A8-multer-%E5%AF%A6%E4%BD%9C%E5%A4%A7%E9%A0%AD%E8%B2%BC%E4%B8%8A%E5%82%B3-ee5bf1683113

// https://www.npmjs.com/package/multer

const imageFileFilter = (req, file, cb) => {
  // console.log(file);
  if (!file.mimetype.startsWith('image')) {
    cb('Supported only image files', false);
  }
  cb(null, true);
};

const videoFileFilter = (req, file, cb) => {
  // console.log(file);
  if (!file.mimetype.startsWith('video')) {
    cb('Supported only video files', false);
  }
  cb(null, true);
};

exports.uploadImage = multer({ storage, fileFilter: imageFileFilter });
exports.uploadVideo = multer({ storage, fileFilter: videoFileFilter });
