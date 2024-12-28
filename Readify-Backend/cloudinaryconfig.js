// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dgolvpztq',  // Replace with your Cloudinary cloud name
  api_key: '893385268431734',       // Replace with your Cloudinary API key
  api_secret: 'YebtBcLaCrDAyZS6c6VHkuN1Qww', // Replace with your Cloudinary API secret
});

module.exports = cloudinary;
