const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const { exec } = require('child_process');
const fs = require('fs');

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  'mongodb+srv://saimalleshgoud:Mybirdidentifierapp123@cluster0.zgk1zdj.mongodb.net/birdapp?retryWrites=true&w=majority&appName=Cluster0'
).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error', err));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use('/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/uploads', (req, res) => {
  const dir = path.join(__dirname, 'uploads');
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).json({ message: 'Error reading uploads folder' });
    const imageUrls = files.map(file => `/uploads/${file}`);
    res.json(imageUrls);
  });
});

app.delete('/uploads', (req, res) => {
  const dir = path.join(__dirname, 'uploads');
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).json({ message: 'Error reading uploads folder' });

    for (const file of files) {
      fs.unlinkSync(path.join(dir, file));
    }

    res.json({ message: 'Upload history cleared' });
  });
});

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({
    message: 'Image uploaded successfully',
    path: req.file.path
  });
});

app.post('/predict', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const imagePath = path.join(__dirname, req.file.path);
  const command = `python ./python/predict.py "${imagePath}"`;

  console.log("📩 Running Python script for:", imagePath);

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Prediction error:", stderr);
      return res.status(500).json({ message: 'Prediction error', error: stderr });
    }

    const birdName = stdout.trim();
    console.log("✅ Predicted Bird:", birdName);

    res.json({ birdName });
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the Bird Identifier Server!');
});

app.listen(5000, () => {
  console.log('✅ Server is running on http://localhost:5000');
});
