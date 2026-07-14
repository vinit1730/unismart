const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Import Routes using robust CommonJS syntax
const authRoutes = require('./routes/auth');
const facultyRoutes = require('./routes/faculty');
const studentRoutes = require('./routes/student');
const attendanceRoutes = require('./routes/attendance');
const aiRoutes = require('./routes/ai');

// Load environment variables
dotenv.config();

// 1. Initialize the App First
const app = express();

// 2. Core Middlewares
app.use(cors());
app.use(express.json());

// 3. Root Route (Fixes the "Cannot GET /" error)
app.get('/', (req, res) => {
  res.send('Unismart Server is up and running successfully!');
});

// 4. API Endpoints Mount
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/ai', aiRoutes);

// 5. Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected', 
    server: 'Running' 
  });
});

// 6. Database Connection & Server Startup
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB cluster connected successfully.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection crash:', err));