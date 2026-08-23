import multer from "multer";

const storage = multer.memoryStorage();

const imageFilter = (_req, file, callback) => {
  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
    return;
  }
  callback(new Error("Only image files are allowed"), false);
};

export const uploadCategoryImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("image");

export function handleCategoryUpload(req, res, next) {
  uploadCategoryImage(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        message: error.message || "Image upload failed",
      });
    }

    return next();
  });
}

export const uploadProductImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
}).array("images", 10);

export function handleProductUpload(req, res, next) {
  uploadProductImages(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        message: error.message || "Image upload failed",
      });
    }

    return next();
  });
}
