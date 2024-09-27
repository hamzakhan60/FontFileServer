const express = require('express');
const cors = require('cors');
const path = require('path');
const useUploadRouter=require("./Routers/upload");
const app = express();
require('dotenv').config();
// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173'],  // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true,                  // Allow cookies and credentials
  optionsSuccessStatus: 200           // For older browsers that may not support default 204 status
};

app.options('*', cors());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Endpoint for uploading the font
app.use('/upload', useUploadRouter);

// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || "3001"}`);
});
