const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload');
const path = require('path');
const uploadController=require("../Controller/upload");

router.use(fileUpload());
router.post('/',uploadController);


  module.exports = router