const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'audio/mpeg' ||
    file.mimetype === 'audio/wave' ||
    file.mimetype === 'audio/wav' ||
    file.mimetype === 'audio/mp3'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }
})
