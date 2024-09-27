const path = require('path');
const uploadController=(req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const fontFile = req.files.fontFile;
  const fileExtension = path.extname(fontFile.name);
  const validExtensions = ['.ttf', '.otf'];  // Valid font extensions

  if (!validExtensions.includes(fileExtension)) {
    return res.status(400).send('Invalid font file type.');
  }

  // Use /tmp directory on Vercel for file uploads
  const fontPath = path.join('/tmp', `user-font${fileExtension}`);
  
  // Move the uploaded file to the /tmp directory
  fontFile.mv(fontPath, (err) => {
    if (err) {
      console.error('File upload error:', err);  // Log error for debugging
      return res.status(500).send('Error uploading file.');
    }
    res.send('Font uploaded successfully');
  });
}


  module.exports=uploadController;