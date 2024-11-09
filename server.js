const express = require('express');
const cors = require('cors');
const path = require('path');
const useUploadRouter = require('./Routers/upload');
const uploadImageRouter=require('./Routers/uploadImage');
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

app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit to 10MB (adjust as needed)
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Increase URL-encoded payload limit


/*step 1: upload image on supabase 
step 2: get imageUrl from supabase
step 3 upload image on printfull*/

app.use('/uploadImage',uploadImageRouter);

// Endpoint for uploading the font
app.use('/upload', useUploadRouter);








// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
