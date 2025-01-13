var express = require("express");
var cors = require("cors");
require("dotenv").config();
const multer = require("multer");
/* let upload = multer(); */
const fs = require("fs");
const path = require("path");

var app = express();

app.use(cors());
app.use("/public", express.static(path.join(process.cwd(), "public")));

// Kontrollera att "uploads"-mappen finns, annars skapa den
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.get("/", function (req, res) {
  res.sendFile(path.join(process.cwd(), "views", "index.html"));
});

// Konfigurera lagring för uppladdade filer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB file size limit
});
// Rutt för filuppladdning
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Ingen fil uppladdad" });
  }

  // Skicka filinformation som JSON
  res.json({
    fileName: req.file.filename, // Filnamnet på servern
    fileType: req.file.mimetype, // Filtyp (t.ex. image/jpeg)
    fileSize: req.file.size, // Filstorlek i bytes
  });
});

// Starta servern
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
