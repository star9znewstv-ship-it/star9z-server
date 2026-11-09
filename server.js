const express = require('express');
const path = require('path');
const app = express();

// ہر طرح کی ویڈیو - MP4, WebM, MOV - سب چلے گی، رکے گی نہیں
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.static(__dirname, {
  maxAge: 0,
  etag: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (filePath.endsWith('.mp4')) res.setHeader('Content-Type', 'video/mp4');
    if (filePath.endsWith('.webm')) res.setHeader('Content-Type', 'video/webm');
    if (filePath.endsWith('.mov')) res.setHeader('Content-Type', 'video/quicktime');
  }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
