const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const useUploadRouter = require('./Routers/upload');
const useUploadPrintifyRouter = require('./Routers/upload-printify');
const app = express();

const axios = require('axios');
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
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Endpoint for uploading the font
app.use('/upload', useUploadRouter);
app.use('/upload-printify', useUploadPrintifyRouter);








// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
