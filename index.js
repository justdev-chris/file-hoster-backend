const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// make sure 'uploaded' folder exists
const uploadDir = path.join(__dirname, 'uploaded');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// set up multer for file uploading 🐾
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safeName = Date.now() + '-' + file.originalname;
    cb(null, safeName);
  }
});

const upload = multer({ storage });

// endpoint for uploading 
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('no file uploaded, nyaaa~ 😿');
  res.send({
    message: 'file uploaded successfully, rawr~!!',
    filename: req.file.filename,
    url: `/files/${req.file.filename}`
  });
});

// serve uploaded files from /files/
app.use('/files', express.static(uploadDir));

// optional homepage
app.get('/', (req, res) => {
  res.send(`
    <h1>nya~ welcome to the uploader 💖</h1>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload File</button>
    </form>
  `);
});

// start server lol
app.listen(PORT, () => {
  console.log(`server purring at http://localhost:${PORT} 🐾`);
});
