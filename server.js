const express = require('express');
const cors = require('cors');
const path = require('path');
const useUploadRouter = require('./Routers/upload');
const app = express();
require('dotenv').config();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],  // Allow both local and production front-end origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true,                        // Allow cookies and credentials
  optionsSuccessStatus: 200                 // For older browsers that may not support default 204 status
};

// Use CORS middleware
app.use(cors());

// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Endpoint for uploading the font
app.use('/upload', useUploadRouter);

app.get('/font', (req, res) => {
    const fontPath = path.join('/tmp', 'user-font.ttf');

  // Send the font file as response
  res.sendFile(fontPath, (err) => {
    if (err) {
      console.error('Error serving font file:', err);
      res.status(404).send('Font file not found.');
    }
  });
});

// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
