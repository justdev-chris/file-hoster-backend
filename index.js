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

// multer setup 
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

// allow CORS nya~ (so front-end can talk to backend)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // or set your site like 'https://catsdevs.online'
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// serve uploaded files as forced downloads 🐾
app.get('/files/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath); // forces download instead of viewing
  } else {
    res.status(404).send('File not found, nya~ 😿');
  }
});

// file upload endpoint 
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('no file uploaded, nyaaa~ 😿');
  const fileUrl = `https://api.catsdevs.online/files/${encodeURIComponent(req.file.filename)}`;
  res.send({
    message: 'file uploaded successfully, rawr~!!',
    filename: req.file.filename,
    url: fileUrl
  });
});

//  welcome page 
app.get('/', (req, res) => {
  res.send(`
    <h1>welcome to the uploader... btw why u here?</h1>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload File</button>
    </form>
  `);
});

// start purring on server nya~
app.listen(PORT, () => {
  console.log(`server purring at http://localhost:${PORT} 🐾`);
});
