const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const userRouter = require("./routes/userRoute.js");
const roomRouter = require("./routes/roomRoute.js");
const eventRouter = require("./routes/eventRoute.js");

const app = express();

//prikazi slike iz uploads direktorija
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/api/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Not selected" });
  }
  res.json({ imageUrl: `http://localhost:5200/uploads/${req.file.filename}` });
});

const db = mongoose.connect("mongodb://localhost/hotelDB");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5200;
app.use("/api", userRouter);
app.use("/api", roomRouter);
app.use("/api", eventRouter);

server = app.listen(port, () => console.log(`Server running on port ${port}`));
