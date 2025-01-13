var express = require("express");
var cors = require("cors");
require("dotenv").config();
const multer = require("multer");
// const upload = multer(); // Removed to avoid redeclaration

var app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
// Konfigurera lagring för uppladdade filer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Mappen där filer sparas
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Anpassat filnamn
  },
});

// Skapa multer-instansen
const upload = multer({ storage: storage });

// Rutt för filuppladdning
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Ingen fil uppladdad' });
  }

  // Skicka filinformation som JSON
  res.json({
    fileName: req.file.filename, // Filnamnet på servern
    fileType: req.file.mimetype, // Filtyp (t.ex. image/jpeg)
    fileSize: req.file.size,     // Filstorlek i bytes
  })
});

// Starta servern
app.listen(3000, () => {
  console.log('Servern körs på http://localhost:3000');});