const express = require("express");

const dotEnv = require("dotenv");
const mongoose = require("mongoose");

const venderRoutes = require("./routes/vendorRoutes")
const bodyParser = require('body-parser')
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors')

const path = require('path')

const app = express()

const PORT = process.env.PORT || 5000;

dotEnv.config();
app.use(cors())


mongoose.connect(process.env.MONGO_URI)
.then(()=> {
    console.log("Mongo DB connected successfully")
})
.catch((error)=> {
    console.log(error)
})

app.use(bodyParser.json())
app.use('/vendor', venderRoutes)
app.use('/firm', firmRoutes)
app.use('/product', productRoutes)
app.use('/uploads', express.static('uploads'))

app.listen(PORT, ()=> {
    console.log(`server started at ${PORT}`)
})

app.use('/', (req, res)=> {
    res.send("<h1>This is Home Page</h1>")
})



// mongodb+srv://<db_username>:<db_password>@manikanta.vgge4.mongodb.net/

// uri
// mongodb+srv://<db_username>:<db_password>@manikanta.vgge4.mongodb.net/?retryWrites=true&w=majority&appName=manikanta