const express = require('express');
const cors = require('cors');
const path = require('path');
const useUploadRouter=require("./Routers/upload");
const app = express();
require('dotenv').config();
app.use(cors({origin:'http://localhost:5173/'}));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Endpoint for uploading the font
app.use('/upload', useUploadRouter);

// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || "3001"}`);
});
