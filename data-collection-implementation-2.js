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
          file.mimetype === 'application/vnd.ms-excel' ||
          file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for biological data'), false);
      }
      break;
    case 'imaging':
      // Allow common medical imaging formats
      if (file.mimetype === 'application/dicom' ||
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/png' ||
          file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for medical imaging'), false);
      }
      break;
    case 'documents':
      // Allow document formats
      if (file.mimetype === 'application/pdf' ||
          file.mimetype === 'application/msword' ||
          file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.mimetype === 'text/plain') {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for documents'), false);
      }
      break;
    default:
      cb(null, true);
  }
};

// Initialize upload middleware
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB file size limit
});

// Models for different data types
const BiologicalSampleSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sampleType: { type: String, required: true }, // blood, urine, saliva, etc.
  collectionDate: { type: Date, default: Date.now },
  processingDate: Date,
  results: mongoose.Schema.Types.Mixed,
  fileUrl: String,
  filePath: String,
  labId: String,
  notes: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sharedWithDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const MedicalImagingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imagingType: { type: String, required: true }, // X-ray, MRI, CT scan, etc.
  bodyPart: String,
  date: { type: Date, default: Date.now },
  fileUrl: String,
  filePath: String,
  facilityName: String,
  radiologistNotes: String,
  doctorNotes: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sharedWithDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const SensorDataSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sensorType: { type: String, required: true }, // heart rate monitor, blood pressure, etc.
  readings: [{
    timestamp: { type: Date, default: Date.now },
    value: mongoose.Schema.Types.Mixed,
    unit: String
  }],
  deviceId: String,
  deviceModel: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sharedWithDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const QuestionnaireSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  questions: [{
    questionText: String,
    answerType: String, // text, multiple choice, scale, etc.
    possibleAnswers: [String],
    answer: mongoose.Schema.Types.Mixed
  }],
  summary: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sharedWithDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const BiologicalSample = mongoose.model('BiologicalSample', BiologicalSampleSchema);
const MedicalImaging = mongoose.model('MedicalImaging', MedicalImagingSchema);
const SensorData = mongoose.model('SensorData', SensorDataSchema);
const Questionnaire = mongoose.model('Questionnaire', QuestionnaireSchema);

// Authentication middleware (to be imported from auth.js)
const authenticateToken = (req, res, next) => {
  // Implementation from the previous code
};

// Routes for biological samples
router.post('/biological', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { patientId, sampleType, collectionDate, labId, notes } = req.body;
    
    // Verify permissions
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const fileUrl = req.file ? `/api/uploads/${req.file.path.replace('\\', '/')}` : null;
    
    const biologicalSample = new BiologicalSample({
      patientId,
      sampleType,
      collectionDate: collectionDate || Date.now(),
      fileUrl,
      filePath: req.file ? req.file.path : null,
      labId,
      notes,
      uploadedBy: req.user.id,
      sharedWithDoctors: []
    });
    
    await biologicalSample.save();
    
    // If patient uploaded, automatically share with assigned doctor
    if (req.user.role === 'patient') {
      const patient = await User.findById(patientId);
      if (patient && patient.assignedDoctor) {
        biologicalSample.sharedWithDoctors.push(patient.assignedDoctor);
        await biologicalSample.save();
      }
    }
    
    res.status(201).json({ 
      message: 'Biological sample data uploaded successfully',
      sampleId: biologicalSample._id
    });
  } catch (error) {
    console.error('Biological sample upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Routes for medical imaging
router.post('/imaging', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { patientId, imagingType, bodyPart, date, facilityName, radiologistNotes } = req.body;
    
    // Verify permissions
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const fileUrl = req.file ? `/api/uploads/${req.file.path.replace('\\', '/')}` : null;
    
    const medicalImaging = new MedicalImaging({
      patientId,
      imagingType,
      bodyPart,
      date: date || Date.now(),
      fileUrl,
      filePath: req.file ? req.file.path : null,
      facilityName,
      radiologistNotes,
      uploadedBy: req.user.id,
      sharedWithDoctors: []
    });
    
    await medicalImaging.save();
    
    // If patient uploaded, automatically share with assigned doctor
    if (req.user.role === 'patient') {
      const patient = await User.findById(patientId);
      if (patient && patient.assignedDoctor) {
        medicalImaging.sharedWithDoctors.push(patient.assignedDoctor);
        await medicalImaging.save();
      }
    }
    
    res.status(201).json({ 
      message: 'Medical imaging uploaded successfully',
      imagingId: medicalImaging._id
    });
  } catch (error) {
    console.error('Medical imaging upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Routes for sensor data
router.post('/sensor', authenticateToken, async (req, res) => {
  try {
    const { patientId, sensorType, readings, deviceId, deviceModel } = req.body;
    
    // Verify permissions
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const sensorData = new SensorData({
      patientId,
      sensorType,
      readings,
      deviceId,
      deviceModel,
      uploadedBy: req.user.id,
      sharedWithDoctors: []
    });
    
    await sensorData.save();
    
    // If patient uploaded, automatically share with assigned doctor
    if (req.user.role === 'patient') {
      const patient = await User.findById(patientId);
      if (patient && patient.assignedDoctor) {
        sensorData.sharedWithDoctors.push(patient.assignedDoctor);
        await sensorData.save();
      }
    }
    
    res.status(201).json({ 
      message: 'Sensor data uploaded successfully',
      sensorDataId: sensorData._id
    });
  } catch (error) {
    console.error('Sensor data upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Routes for questionnaires
router.post('/questionnaire', authenticateToken, async (req, res) => {
  try {
    const { patientId, title, questions, summary } = req.body;
    
    // Verify permissions
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const questionnaire = new Questionnaire({
      patientId,
      title,
      date: Date.now(),
      questions,
      summary,
      uploadedBy: req.user.id,
      sharedWithDoctors: []
    });
    
    await questionnaire.save();
    
    // If patient uploaded, automatically share with assigned doctor
    if (req.user.role === 'patient') {
      const patient = await User.findById(patientId);
      if (patient && patient.assignedDoctor) {
        questionnaire.sharedWithDoctors.push(patient.assignedDoctor);
        await questionnaire.save();
      }
    }
    
    res.status(201).json({ 
      message: 'Questionnaire submitted successfully',
      questionnaireId: questionnaire._id
    });
  } catch (error) {
    console.error('Questionnaire submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get routes for each data type
router.get('/biological/:patientId', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Verify permissions
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    } else if (req.user.role === 'doctor') {
      const patient = await User.findById(patientId);
      if (!patient || !patient.assignedDoctor || patient.assignedDoctor.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }
    
    const samples = await BiologicalSample.find({ patientId }).sort({ collectionDate: -1 });
    res.json(samples);
  } catch (error) {
    console.error('Get biological samples error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Similar get routes for other data types...

module.exports = router;
