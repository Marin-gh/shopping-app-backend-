const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "ShoppingApp",
      allowedFormats: ['jpeg', 'png', 'jpg'],
      transformation: {background: '#FDF5EA', width: 800, height: 600, crop: "pad"}
    }
  });

module.exports = { storage: storage, cloudinary: cloudinary };