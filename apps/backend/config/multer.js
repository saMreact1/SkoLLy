const multer = require('multer');
const path = require('path');

const FILE_PATHS = {
  logo: 'uploads/logos',
  profilePic: 'uploads/profilePics',
  csvFile: 'uploads/csv',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = FILE_PATHS[file.fieldname];

    if (!uploadPath) {
      return cb(new Error(`Unknown field: ${file.fieldname}`));
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

module.exports = upload;
