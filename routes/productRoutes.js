const express = require('express');
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Uploads folder for images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
    }
});

// Multer file filter to restrict file type and size (example for image file types)
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png)!'), false);
    }
};

// Limit file size (in bytes)
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
    fileFilter
});

const router = express.Router();

// Product CRUD routes with image upload
router.post('/add-product/:firmId', upload.single('image'), productController.createProduct); // Added image handling to createProduct
// router.get('/', productController.getAllProducts);
router.get('/:firmId/products', productController.getProductByFirm);

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.headersSent('Content-Type', 'image/jpeg')
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
})


router.delete('/:id', productController.deleteProductById);

module.exports = router;
