const Product = require('../models/Product');
const multer = require('multer');
const path = require('path'); // Add path module
const Firm = require('../models/Firm');

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append current timestamp to filename
    }
});

const upload = multer({ storage: storage });

// Create a Product
const createProduct = async (req, res) => {
    try {
        const { productName, price, description, category, bestSeller } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const firmId = req.params.firmId;  // Use req.params to get firmId
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ error: "Firm not found" });
        }

        const newProduct = new Product({
            productName,
            price,
            description,
            category,
            bestSeller,
            image,
            firm: firm._id
        });

        const savedProduct = await newProduct.save();
        firm.products.push(savedProduct._id); // Add the product to the firm's products array
        await firm.save();

        res.status(201).json({ message: 'Product created successfully', product: savedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error while creating product' });
    }
};

// Get All Products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error while fetching products' });
    }
};

// Get Single Product by ID
const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;  // Use req.params to get firmId
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ error: "Firm not found" });
        }

        const product = await Product.find({ firm: firmId });
        const restaurentName = firm.firmName;
        res.status(200).json({ restaurentName, product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error while fetching product' });
    }
};

const deleteProductById = async(req, res) => {
    try {
        const productId = req.params.productId;
        const deleteProduct = await Product.findByIdAndDelete(productId);
        if(!deleteProduct) {
            return res.status(404).json({error: "No Product found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error while deleting product' });
    }
}

module.exports = {
    createProduct: [upload.single('image'), createProduct], // Separate upload middleware and controller logic
    getAllProducts,
    getProductByFirm,
    deleteProductById
};


