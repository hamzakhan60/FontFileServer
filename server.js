const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const useUploadRouter = require('./Routers/upload');
const getMockUrl=require('./Routers/getMockup');

const uploadImageRouter=require('./Routers/uploadImage');

const useUploadPrintifyRouter = require('./Routers/upload-printify');
const app = express();

const axios = require('axios');
const exp = require('constants');
require('dotenv').config();
app.use(express.json());

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


app.use(express.json({ limit: '50mb' })); // Increase JSON payload limit to 10MB (adjust as needed)
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 10000 }));// Increase URL-encoded payload limit



// Route-specific timeout middleware
app.use('/getMockup', (req, res, next) => {
  // Set timeout for this route to 5 minutes (300,000 ms)
  res.setTimeout(300000, () => {
    console.log('Request timed out.');
    res.status(504).send('Request timeout');
  });
  next();
});
/*step 1: upload image on supabase 
step 2: get imageUrl from supabase
step 3 upload image on printfull*/

app.use('/uploadImage',uploadImageRouter);
app.use('/getMockup',getMockUrl);
// Endpoint for uploading the font
app.use('/upload', useUploadRouter);
app.use('/upload-printify', useUploadPrintifyRouter);








// Start the server
var server = app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

server.setTimeout(120000);
