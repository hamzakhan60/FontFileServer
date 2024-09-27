const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload');
const path = require('path');
const uploadController=require("../Controller/upload");

router.use(fileUpload());
router.post('/',(req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  

  const fontFile = req.files.fontFile;
  const fileExtension = path.extname(fontFile.name);

  const validExtensions = ['.ttf', '.otf'];  // Valid font extensions
  if (!validExtensions.includes(fileExtension)) {
    return res.status(400).send('Invalid font file type.');
  }

  // Define the storage path (on the server)
  const fontsDir = path.join( 'public', 'fonts');  // Or cloud storage path
  console.log(fontsDir);
  const fontPath = path.join(fontsDir, `user-font${fileExtension}`);

  // Save the uploaded font to the server or cloud storage
  fontFile.mv(fontPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('Font uploaded successfully');
  });
}
);

router.get('/',(req,res)=>{
  console.log("hi");
  res.send("okay");
})
  module.exports = router