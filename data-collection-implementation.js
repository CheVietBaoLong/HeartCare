// data-collection.js
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Configure storage for different types of data
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const fileType = req.params.type;
    let uploadPath;
    
    switch(fileType) {
      case 'biological':
        uploadPath = 'uploads/biological';
        break;
      case 'imaging':
        uploadPath = 'uploads/imaging';
        break;
      case 'documents':
        uploadPath = 'uploads/documents';
        break;
      default:
        uploadPath = 'uploads/misc';
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const uniqueId = uuidv4();
    cb(null, `${Date.now()}-${uniqueId}${path.extname(file.originalname)}`);
  }
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const fileType = req.params.type;
  
  switch(fileType) {
    case 'biological':
      // Allow common lab report formats
      if (file.mimetype === 'application/pdf' || 
          file.mimetype === 'text/csv' || 