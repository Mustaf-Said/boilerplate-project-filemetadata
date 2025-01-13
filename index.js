const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use("/public", express.static(path.join(process.cwd(), "public")));

// Kontrollera att "uploads"-mappen finns, annars skapa den
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Konfigurera Multer-lagring
const sanitizeFileName = (fileName) => {
  return fileName.replace(/[^a-z0-9.\-_]/gi, "_").toLowerCase();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${sanitizeFileName(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Fel filtyp. Endast JPEG, PNG, och PDF tillåts."));
    }
    cb(null, true);
  },
});

// Huvudsida
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "views", "index.html"));
});

// Uppladdningsruta
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Ingen fil uppladdad. Kontrollera att formuläret innehåller ett fält som heter 'file'.",
    });
  }

  res.json({
    success: true,
    message: "Filen har laddats upp framgångsrikt!",
    data: {
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    },
  });
});

// Felhanterare för Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: err.message });
  }
  if (err) {
    return res.status(500).json({ success: false, error: "Serverfel: " + err.message });
  }
  next();
});

// Starta servern
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
