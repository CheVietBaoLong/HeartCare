// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(helmet());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], required: true },
  dateOfBirth: Date,
  phoneNumber: String,
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

const patientDataSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateRecorded: { type: Date, default: Date.now },
  heartRate: Number,
  bloodPressureSystolic: Number,
  bloodPressureDiastolic: Number,
  weight: Number,
  notes: String,
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    timeOfDay: String,
    startDate: Date,
    endDate: Date,
    active: Boolean
  }],
  labResults: [{
    testName: String,
    testDate: Date,
    results: mongoose.Schema.Types.Mixed,
    fileUrl: String
  }],
  imagingData: [{
    type: String,
    date: Date,
    fileUrl: String,
    notes: String
  }]
});

const User = mongoose.model('User', userSchema);
const PatientData = mongoose.model('PatientData', patientDataSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, dateOfBirth, phoneNumber, assignedDoctor } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      dateOfBirth,
      phoneNumber,
      assignedDoctor,
      updatedAt: Date.now()
    });

    await user.save();

    // Update doctor's patient list if applicable
    if (role === 'patient' && assignedDoctor) {
      await User.findByIdAndUpdate(assignedDoctor, {
        $push: { patients: user._id },
        updatedAt: Date.now()
      });
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Patient data routes
app.post('/api/patient-data', authenticateToken, async (req, res) => {
  try {
    const { patientId, heartRate, bloodPressureSystolic, bloodPressureDiastolic, weight, notes, medications } = req.body;
    
    // Verify the requester is the patient or their doctor
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    } else if (req.user.role === 'doctor') {
      const patient = await User.findById(patientId);
      if (!patient || !patient.assignedDoctor || patient.assignedDoctor.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }

    // Create new patient data entry
    const patientData = new PatientData({
      patientId,
      heartRate,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      weight,
      notes,
      medications
    });

    await patientData.save();
    res.status(201).json({ message: 'Patient data saved successfully' });
  } catch (error) {
    console.error('Patient data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient data
app.get('/api/patient-data/:patientId', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Verify the requester is the patient or their doctor
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    } else if (req.user.role === 'doctor') {
      const patient = await User.findById(patientId);
      if (!patient || !patient.assignedDoctor || patient.assignedDoctor.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }

    // Fetch patient data
    const patientData = await PatientData.find({ patientId }).sort({ dateRecorded: -1 });
    res.json(patientData);
  } catch (error) {
    console.error('Get patient data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload biological sample data
app.post('/api/biological-sample', authenticateToken, async (req, res) => {
  // Implementation for handling biological sample data
  // Would include validation, storage, and association with patient record
  res.status(201).json({ message: 'Sample data uploaded successfully' });
});

// Upload medical imaging
app.post('/api/medical-imaging', authenticateToken, async (req, res) => {
  // Implementation for handling medical imaging data
  // Would include validation, storage, and association with patient record
  res.status(201).json({ message: 'Imaging data uploaded successfully' });
});

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
