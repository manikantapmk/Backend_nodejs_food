const Vendor = require('../models/Vender')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv = require("dotenv");


dotEnv.config();

const secretKey = process.env.whatIsYourName


const vendorRegister = async(req, res)=> {
    const { username, email, password } = req.body
    try {
        const vendorEmail = await Vendor.findOne({ email })
        if(vendorEmail) {
            return res.status(400).json("Email already taken")
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newVender = new Vendor({
            username,
            email,
            password: hashedPassword
        });
        await newVender.save();

        res.status(201).json({
            message: "Vender registered Successfully"
        })
        console.log("registered");
        
    } catch (error) {
        console.error(error);
        
        res.status(500).json({error: "INternal server error"})
    }
}

const vendorLogin = async (req, res)=> {
    const { email, password } = req.body;

    try {

        const vender = await Vendor.findOne({email});
        if(!vender || !(await bcrypt.compare(password, vender.password))){
            return res.status(401).json({error: "Invalid User Name or Password"})
        }

        const token = jwt.sign({vendorId: vender._id}, secretKey, {expiresIn: "1h"})


        res.status(200).json({success: "Login successful", token})
        console.log(email, "this is token", token);

    } catch (error) {
        console.error(error);
        
        res.status(500).json({error: "Login Internal server error"})
    }
}


const getAllVendors = async(req, res)=> {
    try {
        const vendors = await Vendor.find().populate('firm')
        res.json({vendors})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"})
    }
}

const getVendorById = async(req, res)=> {
    const vendorId = req.params.id;

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            return res.status(404).json({error: "Vendor not found getVendorById"})
        }
        res.status(200).json({vendor})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"})
    }
}

module.exports= {vendorRegister, vendorLogin, getAllVendors, getVendorById}

