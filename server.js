const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }
});

app.get('/', (req, res) => {
  res.send('STAR 9Z SERVER CHAL RAHA HAI ✅ - 2.5 Ghante Video Ready');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server ready for long videos' });
});

app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Video nahi mili' });
  res.json({ 
    status: 'ok', 
    message: 'Video upload ho gayi ✅',
    filename: req.file.filename,
    size: req.file.size,
    url: '/video/' + req.file.filename
  });
});

app.get('/video/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send('Video nahi mili');
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = { 'Content-Length': fileSize, 'Content-Type': 'video/mp4' };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

app.post('/render', (req, res) => {
  res.json({ status: 'ok', message: 'Server ready for rendering' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('STAR 9Z Server ' + PORT + ' par chal raha hai'));
