var express = require("express");
const multer = require("multer");
var cors = require("cors");
require("dotenv").config();

var app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Konfigurera uppladdningslagring
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Mappen där filer lagras
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Anpassat filnamn
  },
});

// Skapa en multer-instans med ovanstående lagring
const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  // 'file' är namnet på fältet i formuläret
  res.send(`Filen har laddats upp: ${req.file.filename}`);
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
