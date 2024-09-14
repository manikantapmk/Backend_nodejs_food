const Firm = require('../models/Firm');
const Vendor = require('../models/Vender');
const multer = require('multer');
const path = require('path');

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

const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;

        // Check if the image was uploaded
        const image = req.file? req.file.filename : undefined;

        // Ensure vendor exists
        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        // Create new Firm
        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        });

        // Save Firm and handle validation errors
        const saveFirm = await firm.save();

        vendor.firm.push(saveFirm);

        await vendor.save();
        return res.status(200).json({ message: "Firm added successfully" });

    } catch (error) {
        console.error("Error while adding firm:", error);

        // Check if it's a validation error
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Firm validation failed",
                errors: error.errors // Provide specific field errors to the client
            });
        }

        // Return generic server error for other cases
        return res.status(500).json({ error: "Internal server error from firmController" });
    }
};

const deleteFirmById = async(req, res) => {
    try {
        const firmId = req.params.firmId;
        const deleteProduct = await Product.findByIdAndDelete(firmId);
        if(!deleteProduct) {
            return res.status(404).json({error: "No Product found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error while deleting product' });
    }
}

// Middleware to handle file upload and firm addition
module.exports = { addFirm: [upload.single('image'), addFirm], deleteFirmById };
