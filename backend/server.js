const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute.js");
const roomRouter = require("./routes/roomRoute.js");

const app = express();

const db = mongoose.connect('mongodb://localhost/hotelDB')


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())


const port = process.env.PORT || 5200;
app.use('/api', userRouter)
app.use('/api', roomRouter)



server = app.listen(port, () => console.log(`Server running on port ${port}`));