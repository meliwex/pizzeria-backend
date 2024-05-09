import multer from "multer"
import path from 'node:path'
import { v4 as uuidv4 } from 'uuid';


export const strgPath = "./src/assets/imgs"; 

const storageConfig = {
  destination: function (req, file, cb) {
    cb(null, strgPath)
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname)
    cb(null, uuidv4() + extName)
  }
}

const storage = multer.diskStorage(storageConfig)



const multerConfig = {
  storage: storage,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);

    const allowedExts = ['.png', '.jpg', '.jpeg']

    if (!allowedExts.includes(ext)) {
      return callback('Only .png .jpg .jpeg are allowed', false)
    }

    callback(null, true)
  },
  limits: { fileSize: 2097152 /* 2MB */ }
}


export const uploadImage = (req, res, next) => {
  const upload = multer(multerConfig).single('image');

  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({
        success: false,
        errors: err
      });
    } else {
      next()
    }
  })
}