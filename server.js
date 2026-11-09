const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();

const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use('/uploads', express.static(uploadDir));

app.get('/', (req, res) => {
  const files = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
  const last = files[files.length - 1];
  const videoUrl = last ? `/uploads/${last}` : '';

  res.send(`
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>STAR9Z NEWS</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif}
body{background:#000;color:#fff}
.top{background:linear-gradient(#ff0000,#a00000);display:flex;justify-content:space-between;align-items:center;padding:10px 12px;box-shadow:0 5px 15px rgba(0,0,0,.7)}
.logo{font-size:28px;font-weight:900;letter-spacing:1px;text-shadow:2px 2px 0 #000, 0 0 15px #fff}
.logo span{color:yellow}
.live{background:yellow;color:red;font-weight:900;padding:6px 12px;border-radius:5px;box-shadow:0 4px 0 #8a0000}
.studio{position:relative;background:#111;padding:10px}
video{width:100%;max-height:62vh;background:#000;border:4px solid #fff;border-radius:10px;box-shadow:0 10px 25px rgba(255,0,0,.5)}
/* 3D Time Box - wahi purana box */
.timebox{position:absolute;top:22px;right:18px;background:linear-gradient(145deg,#fff,#c0c0c0);color:#000;padding:8px 12px;border-radius:10px;text-align:center;box-shadow:0 6px 0 #555, 0 10px 20px rgba(0,0,0,.6);border:2px solid #ff0000;transform:perspective(500px) rotateY(-8deg)}
.timebox b{font-size:18px;display:block}
.timebox span{font-size:12px;font-weight:bold;color:#c00000}
.lower{position:absolute;left:10px;right:10px;bottom:22px;display:flex;gap:8px;align-items:flex-end}
.break{background:red;color:#fff;font-weight:900;padding:10px 14px;border-radius:5px;box-shadow:0 4px 0 #700;white-space:nowrap}
.ticker{flex:1;background:rgba(0,0,0,.75);border:2px solid #fff;padding:10px;overflow:hidden;white-space:nowrap}
.ticker span{display:inline-block;animation:move 18s linear infinite}
@keyframes move{from{transform:translateX(100%)}to{transform:translateX(-100%)}}
.box{background:#0a1a3a;padding:15px;margin:12px;border-radius:12px;box-shadow:0 8px 0 #000, inset 0 0 20px rgba(255,255,255,.15);border:2px solid #2a4a9a}
input[type=file]{width:100%;padding:10px;background:#fff;border-radius:8px;color:#000;margin:8px 0}
button{width:100%;padding:13px;background:linear-gradient(#ff0000,#a00000);color:#fff;font-size:18px;font-weight:900;border:none;border-radius:8px;box-shadow:0 5px 0 #600}
.down{display:block;text-align:center;margin-top:10px;padding:13px;background:green;color:#fff;font-weight:900;text-decoration:none;border-radius:8px;box-shadow:0 5px 0 #003300}
.list a{color:yellow;display:block;padding:6px 0}
</style></head>
<body>
<div class="top"><div class="logo">STAR<span>9Z</span> NEWS</div><div class="live">● LIVE</div></div>
<div class="studio">
  ${videoUrl ? `<video src="${videoUrl}" controls autoplay></video>` : `<div style="text-align:center;padding:50px;background:#222;border-radius:10px">کوئی ویڈیو نہیں، نیچے سے ویڈیو ڈالیں</div>`}
  <div class="timebox"><b id="time">--:--:--</b><span id="date">--</span></div>
  <div class="lower"><div class="break">BREAKING NEWS</div><div class="ticker"><span>STAR9Z NEWS - بڑی خبر - آپ کی آواز، آپ کی خبر - تازہ ترین خبریں سب سے پہلے صرف STAR9Z NEWS پر -</span></div></div>
</div>
<div class="box">
  <h3>📤 ویڈیو اپ لوڈ کریں - 2 منٹ، 50 منٹ، 2 گھنٹے</h3>
  <form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="video" accept="video/*" required>
    <button type="submit">UPLOAD کریں</button>
  </form>
  ${videoUrl ? `<a class="down" href="${videoUrl}" download>⬇️ ویڈیو ڈاؤن لوڈ کریں</a>` : ''}
</div>
<div class="box"><h3>پرانی ویڈیوز</h3><div class="list">${files.map(f=>`<a href="/uploads/${f}">▶ ${f}</a>`).join('') || 'ابھی کوئی ویڈیو نہیں'}</div></div>
<script>
function upd(){let d=new Date();document.getElementById('time').innerText=d.toLocaleTimeString('ur-PK');document.getElementById('date').innerText=d.toLocaleDateString('ur-PK',{weekday:'long',year:'numeric',month:'long',day:'numeric'});}
setInterval(upd,1000);upd();
</script>
</body></html>
  `);
});

app.post('/upload', upload.single('video'), (req, res) => res.redirect('/'));
module.exports = app;
