const multer = require("multer");
const path = require('path');
const fs = require('fs');




const destinationDir = path.join(__dirname, 'public', 'temp');

if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,destinationDir)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

 const upload = multer({ storage})

 module.exports = upload ;
