import * as multer from "multer";
// - - Multer - -

// Local Storage
// const upload = multer({ dest: "./src/uploads/" });

// Upload to Cloudinary
const storage = multer.diskStorage({
  filename: function(_: any, file: any, callback: any) {
    callback(null, Date.now() + file.originalname);
  }
});

const imageFilter = function(_: any, file: any, cb: any) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

export const upload = multer({ storage: storage, fileFilter: imageFilter });
