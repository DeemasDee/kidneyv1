const express = require('express');
const multer = require('multer');
const path = require('path');
const { predictImage } = require('./prediction');

const app = express();
const UPLOAD_FOLDER = path.join(__dirname, 'public', 'uploads');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/predict', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.render('error', { message: 'No file part' });
  }

  try {
    const imagePath = path.join(UPLOAD_FOLDER, req.file.filename);
    const { predictedLabel, confidence } = await predictImage(imagePath);
    res.render('predict', { imagePath: `/uploads/${req.file.filename}`, predictedLabel, confidence });
  } catch (error) {
    console.error('Error during prediction:', error);
    res.render('error', { message: 'Error during prediction' });
  }
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
