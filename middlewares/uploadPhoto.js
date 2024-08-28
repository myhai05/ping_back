const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/profil');
      //console.log(req);
    },
    filename: function (req, file, cb) {
      let ext = path.extname(file.originalname)
      cb(null, Date.now() + ext);
    }
  })
  const uploadPhoto = multer({ 
    storage: storage,
    //fileFilter:  
});

module.exports = uploadPhoto;