
const express = require('express');
const path = require('path');

const firmController = require('../controllers/firmController')
const verifytoken = require('../middlewares/verifytoken')

const router = express.Router()

router.post('/add-firm', verifytoken, firmController.addFirm)


router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.headersSent('Content-Type', 'image/jpeg')
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
})

router.delete('/:id', firmController.deleteFirmById);

module.exports = router;