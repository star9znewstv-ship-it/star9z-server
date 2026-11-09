const express = require('express');
const path = require('path');
const app = express();

// ہر چیز خود ہی ایڈجسٹ ہو جائے گی - کوئی رکنا نہیں، کوئی ٹوٹنا نہیں
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// ویڈیو، تصویر، سب کچھ تیز اور فل ایچ ڈی میں چلے گا
app.use(express.static(__dirname, {
  maxAge: 0,
  etag: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
    if (filePath.endsWith('.mp4') || filePath.endsWith('.webm')) {
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// ہر بار نیا والا index.html ہی کھلے گا - پرانا نہیں کھلے گا
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// اگر کوئی اور لنک کھولے تو بھی وہی اسٹوڈیو کھلے
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('STAR 9Z SERVER RUNNING ON ' + PORT);
  });
}

module.exports = app;
