import fs from 'fs';
import path from 'path';

const files = {
  // CONFIGURATION & ENTRY POINTS
  'server/package.json': `{
  "name": "unismart-server",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "axios": "^1.7.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "exceljs": "^4.4.0",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.4.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.13"
  },
  "devDependencies": {
    "nodemon": "^3.1.2"
  }
}`,
  'server/.env': `PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/unismart
JWT_SECRET=super_secret_session_key_12345
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173`,

  'server/server.js': `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected', server: 'Running' });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB cluster connected successfully.');
    app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
  })
  .catch(err => console.error('Database connection crash:', err));`,

  // DATABASE MODELS
  'server/models/Faculty.js': `import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  department: { type: String, required: true, trim: true },
  academicYear: { type: String, required: true, trim: true },
  designation: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Faculty = mongoose.model('Faculty', facultySchema);
export default Faculty;`,

  'server/models/Student.js': `import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  batch: { type: String, required: true, trim: true },
  semesterNumber: { type: Number, required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true }
}, { timestamps: true });

studentSchema.index({ facultyId: 1, batch: 1, semesterNumber: 1 });

const Student = mongoose.model('Student', studentSchema);
export default Student;`,

  'server/models/Attendance.js': `import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  date: { type: Date, required: true },
  batch: { type: String, required: true, trim: true },
  semesterNumber: { type: Number, required: true },
  records: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['PRESENT', 'ABSENT'], required: true }
  }]
}, { timestamps: true });

attendanceSchema.index({ facultyId: 1, date: 1, batch: 1, semesterNumber: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;`,

  'server/models/Otp.js': `import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }
});

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;`,

  // MIDDLEWARES & CONTROLLERS
  'server/middlewares/authMiddleware.js': `import jwt from 'jsonwebtoken';
import Faculty from '../models/Faculty.js';

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, token missing.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'ADMIN') {
      req.user = { role: 'ADMIN', email: decoded.email, name: 'Super Admin' };
    } else {
      req.user = await Faculty.findById(decoded.id);
      if (!req.user || !req.user.isActive) return res.status(401).json({ success: false, message: 'User suspended or missing.' });
      req.user.role = 'FACULTY';
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session signature expired or corrupted.' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: \`Role tiering exception: Access Denied.\` });
  }
  next();
};`,

  'server/controllers/authController.js': `import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Otp from '../models/Otp.js';
import Faculty from '../models/Faculty.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email target is required.' });

    const cleanEmail = email.toLowerCase().trim();
    const isAdmin = cleanEmail === 'admin@university.edu';
    
    if (!isAdmin) {
      const faculty = await Faculty.findOne({ email: cleanEmail, isActive: true });
      if (!faculty) return res.status(404).json({ success: false, message: 'Access denied. Account not registered.' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.findOneAndUpdate({ email: cleanEmail }, { otp: code }, { upsert: true, new: true });

    await transporter.sendMail({
      from: \`"UniSmart Gatekeeper" <\${process.env.EMAIL_USER}>\`,
      to: cleanEmail,
      subject: 'Your Institutional Verification OTP',
      text: \`Your login code code is: \${code}. Valid for 5 minutes.\`
    });

    return res.status(200).json({ success: true, message: 'One-time passcode dispatched.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Email system network issue.' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const record = await Otp.findOne({ email: cleanEmail, otp });
    if (!record) return res.status(400).json({ success: false, message: 'Invalid or expired code.' });

    await Otp.deleteOne({ _id: record._id });

    const isAdmin = cleanEmail === 'admin@university.edu';
    let userPayload = { email: cleanEmail, role: isAdmin ? 'ADMIN' : 'FACULTY', name: isAdmin ? 'Super Admin' : '' };

    if (!isAdmin) {
      const faculty = await Faculty.findOne({ email: cleanEmail });
      userPayload.id = faculty._id;
      userPayload.name = faculty.name;
    }

    const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({ success: true, token, user: userPayload });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Verification validation error.' });
  }
};`,

  'server/controllers/facultyController.js': `import Faculty from '../models/Faculty.js';

export const createFaculty = async (req, res) => {
  try {
    const { name, email, department, academicYear, designation } = req.body;
    if (!name || !email || !department || !academicYear) return res.status(400).json({ success: false, message: 'Missing values.' });

    const exist = await Faculty.findOne({ email: email.toLowerCase() });
    if (exist) return res.status(409).json({ success: false, message: 'Email conflict.' });

    const doc = await Faculty.create({ name, email: email.toLowerCase(), department, academicYear, designation });
    return res.status(201).json({ success: true, data: doc });
  } catch (err) { return res.status(500).json({ success: false }); }
};

export const getAllFaculty = async (req, res) => {
  const list = await Faculty.find({}).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: list });
};

export const updateFaculty = async (req, res) => {
  const doc = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, data: doc });
};

export const deleteFaculty = async (req, res) => {
  await Faculty.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Removed' });
};`,

  'server/controllers/studentController.js': `import ExcelJS from 'exceljs';
import fs from 'fs';
import Student from '../models/Student.js';

export const uploadStudentsExcel = async (req, res) => {
  try {
    const { facultyId } = req.body;
    if (!req.file || !facultyId) return res.status(400).json({ success: false, message: 'Parameters missing.' });

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(req.file.path);
    const ws = wb.worksheets[0];

    const records = [];
    ws.eachRow((row, index) => {
      if (index === 1) return;
      records.push({
        name: row.getCell(1).text?.trim(),
        rollNumber: row.getCell(2).text?.trim().toUpperCase(),
        email: row.getCell(3).text?.trim().toLowerCase(),
        batch: row.getCell(4).text?.trim(),
        semesterNumber: parseInt(row.getCell(5).text),
        facultyId
      });
    });

    fs.unlinkSync(req.file.path);
    
    let count = 0;
    for (const s of records) {
      if (!s.rollNumber || !s.email) continue;
      const exist = await Student.findOne({ $or: [{ rollNumber: s.rollNumber }, { email: s.email }] });
      if (!exist) { await Student.create(s); count++; }
    }

    return res.status(200).json({ success: true, message: \`Import complete. Onboarded: \${count}\` });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

export const getStudents = async (req, res) => {
  const filters = {};
  if (req.query.facultyId) filters.facultyId = req.query.facultyId;
  if (req.query.batch) filters.batch = req.query.batch;
  if (req.query.semester) filters.semesterNumber = parseInt(req.query.semester);
  const data = await Student.find(filters).sort({ rollNumber: 1 });
  res.status(200).json({ success: true, data });
};

export const deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true });
};`,

  'server/controllers/attendanceController.js': `import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import ExcelJS from 'exceljs';

export const saveAttendance = async (req, res) => {
  const { facultyId, date, batch, semesterNumber, records } = req.body;
  const parsedDate = new Date(date);
  parsedDate.setUTCHours(0,0,0,0);

  const doc = await Attendance.findOneAndUpdate(
    { facultyId, date: parsedDate, batch, semesterNumber },
    { records },
    { upsert: true, new: true }
  );
  res.status(200).json({ success: true, data: doc });
};

export const getAttendanceByFilter = async (req, res) => {
  const parsedDate = new Date(req.query.date);
  parsedDate.setUTCHours(0,0,0,0);
  const doc = await Attendance.findOne({
    facultyId: req.query.facultyId,
    batch: req.query.batch,
    semesterNumber: parseInt(req.query.semesterNumber),
    date: parsedDate
  }).populate('records.studentId', 'name rollNumber');
  res.status(200).json({ success: true, data: doc });
};

export const downloadAttendanceReport = async (req, res) => {
  const { facultyId, batch, semesterNumber } = req.query;
  const students = await Student.find({ facultyId, batch, semesterNumber }).sort({ rollNumber: 1 });
  const logs = await Attendance.find({ facultyId, batch, semesterNumber }).sort({ date: 1 });

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Summary');

  const headers = ['Roll Number', 'Name', 'Total Classes', 'Present', '% Compliance'];
  logs.forEach(l => headers.push(new Date(l.date).toISOString().split('T')[0]));
  ws.addRow(headers);

  students.forEach(s => {
    let pres = 0;
    const row = [s.rollNumber, s.name, logs.length];
    const statCells = [];
    logs.forEach(l => {
      const match = l.records.find(r => r.studentId.toString() === s._id.toString());
      const res = match ? match.status : 'ABSENT';
      if (res === 'PRESENT') pres++;
      statCells.push(res);
    });
    row.push(pres, logs.length ? ((pres/logs.length)*100).toFixed(1)+'%' : '100%', ...statCells);
    ws.addRow(row);
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=Report.xlsx');
  await wb.xlsx.write(res);
  res.end();
};`,

  'server/controllers/aiController.js': `import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getStudentPredictiveInsights = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const logs = await Attendance.find({ batch: student.batch, semesterNumber: student.semesterNumber });
    let total = logs.length, present = 0, consecutive = 0, run = 0;

    logs.forEach(l => {
      const match = l.records.find(r => r.studentId.toString() === student._id.toString());
      if (match && match.status === 'PRESENT') { present++; run = 0; }
      else { run++; if (run > consecutive) consecutive = run; }
    });

    const pct = total > 0 ? (present / total) * 100 : 100.0;
    const payload = { attendancePercentage: pct, missedConsecutive: consecutive, engagementScore: pct / 10 };

    const py = spawn('python', [path.join(__dirname, '../ml/predict.py')]);
    let out = '';
    
    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();

    py.stdout.on('data', d => out += d.toString());
    py.on('close', () => {
      const ai = JSON.parse(out);
      res.status(200).json({ success: true, data: { studentName: student.name, rollNumber: student.rollNumber, attendancePercentage: pct.toFixed(1), missedConsecutive: consecutive, ...ai } });
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};`,

  // ROUTES
  'server/routes/authRoutes.js': `import express from 'express';
import { sendOtp, verifyOtp } from '../controllers/authController.js';
const router = express.Router();
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
export default router;`,

  'server/routes/facultyRoutes.js': `import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { createFaculty, getAllFaculty, updateFaculty, deleteFaculty } from '../controllers/facultyController.js';
const router = express.Router();
router.use(protect, authorize('ADMIN'));
router.post('/', createFaculty);
router.get('/', getAllFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);
export default router;`,

  'server/routes/studentRoutes.js': `import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { uploadStudentsExcel, getStudents, deleteStudent } from '../controllers/studentController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(protect);
router.post('/upload', authorize('ADMIN'), upload.single('file'), uploadStudentsExcel);
router.get('/', authorize('ADMIN', 'FACULTY'), getStudents);
router.delete('/:id', authorize('ADMIN'), deleteStudent);
export default router;`,

  'server/routes/attendanceRoutes.js': `import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { saveAttendance, getAttendanceByFilter, downloadAttendanceReport } from '../controllers/attendanceController.js';
const router = express.Router();
router.use(protect);
router.post('/save', authorize('FACULTY'), saveAttendance);
router.get('/query', authorize('FACULTY', 'ADMIN'), getAttendanceByFilter);
router.get('/report', authorize('FACULTY', 'ADMIN'), downloadAttendanceReport);
export default router;`,

  'server/routes/aiRoutes.js': `import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { getStudentPredictiveInsights } from '../controllers/aiController.js';
const router = express.Router();
router.get('/insights/:studentId', protect, authorize('ADMIN', 'FACULTY'), getStudentPredictiveInsights);
export default router;`,

  // PYTHON AI
  'server/ml/predict.py': `import sys
import json

def main():
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            return
        data = json.loads(raw)
        
        pct = float(data.get("attendancePercentage", 100.0))
        consecutive = int(data.get("missedConsecutive", 0))
        engagement = float(data.get("engagementScore", 10.0))
        
        risk_idx = ((100.0 - pct) * 0.5) + (min(consecutive, 5) * 6.0) + ((10.0 - engagement) * 2.0)
        
        if risk_idx > 45 or pct < 75.0:
            risk, rec = "High Risk", "Initiate direct formal warning notification. Require mandatory counseling review."
        elif risk_idx > 20:
            risk, rec = "Medium Risk", "Issue internal dashboard reminder alert. Recommend faculty mentor outreach."
        else:
            risk, rec = "Low Risk", "Student demonstrates continuous baseline tracking. Maintain entry cadence."

        print(json.dumps({
            "riskClassification": risk,
            "riskIndexPercentage": round(min(risk_idx, 100.0), 1),
            "aiRecommendation": rec
        }))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()`,

  // FRONTEND CONFIGURATIONS
  'client/package.json': `{
  "name": "unismart-client",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.2.5",
    "axios": "^1.7.2",
    "lucide-react": "^0.395.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hot-toast": "^2.4.1",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.23.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.2.11"
  }
}`,

  'client/src/services/api.js': `import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

export default API;`,

  'client/src/redux/store.js': `import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import facultyReducer from './slices/facultySlice';

export const store = configureStore({
  reducer: { auth: authReducer, faculty: facultyReducer }
});`,

  'client/src/redux/slices/authSlice.js': `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const sendOtp = createAsyncThunk('auth/sendOtp', async (email, { rejectWithValue }) => {
  try {
    await API.post('/auth/send-otp', { email });
    return email;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Error running access check.'); }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ email, otp }, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/verify-otp', { email, otp });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Invalid code matching error.'); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null,
    loading: false,
    otpSent: false,
    currentEmail: '',
    error: null
  },
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.user = null; state.token = null; state.otpSent = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendOtp.fulfilled, (state, action) => { state.loading = false; state.otpSent = true; state.currentEmail = action.payload; })
      .addCase(sendOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(verifyOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyOtp.fulfilled, (state, action) => { state.loading = false; state.token = action.payload.token; state.user = action.payload.user; })
      .addCase(verifyOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;`,

  'client/src/redux/slices/facultySlice.js': `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchAllFaculties = createAsyncThunk('faculty/fetchAll', async () => {
  const res = await API.get('/faculty');
  return res.data.data;
});

export const addFacultyRecord = createAsyncThunk('faculty/add', async (form) => {
  const res = await API.post('/faculty', form);
  return res.data.data;
});

export const purgeFacultyRecord = createAsyncThunk('faculty/purge', async (id) => {
  await API.delete(\`/faculty/\${id}\`);
  return id;
});

const facultySlice = createSlice({
  name: 'faculty',
  initialState: { faculties: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFaculties.fulfilled, (state, action) => { state.faculties = action.payload; })
      .addCase(addFacultyRecord.fulfilled, (state, action) => { state.faculties.unshift(action.payload); })
      .addCase(purgeFacultyRecord.fulfilled, (state, action) => { state.faculties = state.faculties.filter(f => f._id !== action.payload); });
  }
});
export default facultySlice.reducer;`,

  // UI ELEMENTS & PAGES
  'client/src/components/Navbar.jsx': `import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GraduationCap, LogOut } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center font-sans">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white"><GraduationCap className="h-5 w-5" /></div>
        <span className="text-lg font-bold text-gray-900">UniSmart Console</span>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-bold text-gray-800">{user.name}</div>
            <div className="text-[10px] text-gray-400 font-mono uppercase">{user.role} Portal</div>
          </div>
          {user.role === 'ADMIN' && (
            <div className="flex gap-3 text-xs font-medium text-gray-600">
              <Link to="/admin/faculty" className="hover:text-blue-600">Faculty Records</Link>
              <Link to="/admin/students" className="hover:text-blue-600">Bulk Ingestion</Link>
            </div>
          )}
          {user.role === 'FACULTY' && (
            <div className="flex gap-3 text-xs font-medium text-gray-600">
              <Link to="/faculty/calendar" className="hover:text-teal-600">Mark Attendance</Link>
              <Link to="/faculty/insights" className="hover:text-purple-600">Predictive AI</Link>
            </div>
          )}
          <button onClick={() => { dispatch(logout()); navigate('/'); }} className="text-gray-400 hover:text-red-600"><LogOut className="h-4 w-4" /></button>
        </div>
      )}
    </nav>
  );
}`,

  'client/src/pages/LandingPage.jsx': `import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, UserCheck, GraduationCap } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans px-4">
      <div className="text-center max-w-xl">
        <div className="bg-blue-600 w-fit p-3 rounded-2xl text-white mx-auto mb-4 shadow-sm"><GraduationCap className="h-10 w-10" /></div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">UniSmart Academic Engine</h1>
        <p className="text-sm text-gray-500 mt-2">Enterprise-grade attendance tracking lifecycle paired with child-process automated Python AI model analytics.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div onClick={() => navigate('/login?role=admin')} className="bg-white p-5 border border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition-all shadow-xs">
            <ShieldAlert className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900 text-sm">Super Admin System</h3>
          </div>
          <div onClick={() => navigate('/login?role=faculty')} className="bg-white p-5 border border-gray-200 rounded-xl cursor-pointer hover:border-teal-500 transition-all shadow-xs">
            <UserCheck className="h-6 w-6 text-teal-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900 text-sm">Faculty Operational Hub</h3>
          </div>
        </div>
      </div>
    </div>
  );
}`,

  'client/src/pages/Login.jsx': `import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = params.get('role') || 'faculty';
  
  const [email, setEmail] = useState('');
  const { loading, otpSent, error } = useSelector(state => state.auth);

  useEffect(() => {
    if (otpSent) {
      toast.success('Passcode sent.');
      navigate(\`/verify?email=\${encodeURIComponent(email)}\`);
    }
    if (error) toast.error(error);
  }, [otpSent, error, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 font-sans">
      <div className="bg-white p-8 max-w-md w-full mx-auto border border-gray-200 rounded-xl shadow-xs">
        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800 mb-1">{role} Authorization</h2>
        <p className="text-xs text-gray-400 mb-4">Provide institutional registration handle details below.</p>
        <form onSubmit={(e) => { e.preventDefault(); dispatch(sendOtp(email)); }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="username@university.edu" className="w-full text-sm border p-2.5 rounded-lg mb-3" required />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 px-4 rounded-lg transition-colors">{loading ? 'Sending...' : 'Request Verification OTP'}</button>
        </form>
      </div>
    </div>
  );
}`,

  'client/src/pages/VerifyOtp.jsx': `import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function VerifyOtp() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const email = params.get('email') || '';
  const [otp, setOtp] = useState('');
  const { user, error } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      toast.success('Session verified.');
      navigate(user.role === 'ADMIN' ? '/admin/faculty' : '/faculty/calendar');
    }
    if (error) toast.error(error);
  }, [user, error, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 font-sans">
      <div className="bg-white p-8 max-w-md w-full mx-auto border border-gray-200 rounded-xl">
        <h2 className="text-base font-bold text-gray-800 mb-1">Confirm Session Passcode</h2>
        <p className="text-xs text-gray-400 mb-4">Input the code sent to {email}</p>
        <form onSubmit={(e) => { e.preventDefault(); dispatch(verifyOtp({ email, otp })); }}>
          <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" className="w-full text-center tracking-widest text-lg font-mono border p-2 rounded-lg mb-3" required />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-2 rounded-lg">Validate Token</button>
        </form>
      </div>
    </div>
  );
}`,

  'client/src/pages/FacultyManagement.jsx': `import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFaculties, addFacultyRecord, purgeFacultyRecord } from '../redux/slices/facultySlice';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function FacultyManagement() {
  const dispatch = useDispatch();
  const { faculties } = useSelector(state => state.faculty);
  const [form, setForm] = useState({ name: '', email: '', department: '', academicYear: '' });

  useEffect(() => { dispatch(fetchAllFaculties()); }, [dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(addFacultyRecord(form));
    toast.success('Onboarded');
    setForm({ name: '', email: '', department: '', academicYear: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-gray-200 rounded-xl h-fit">
          <h3 className="font-bold text-sm mb-3 text-gray-800">Add Faculty Profile</h3>
          <form onSubmit={onSubmit} className="space-y-3">
            <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full text-xs border p-2 rounded" required />
            <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full text-xs border p-2 rounded" required />
            <input placeholder="Dept (e.g. CSE)" value={form.department} onChange={e=>setForm({...form, department: e.target.value})} className="w-full text-xs border p-2 rounded" required />
            <input placeholder="Year" value={form.academicYear} onChange={e=>setForm({...form, academicYear: e.target.value})} className="w-full text-xs border p-2 rounded" required />
            <button className="w-full bg-blue-600 text-white text-xs py-2 rounded font-medium">Create</button>
          </form>
        </div>
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 font-bold text-gray-600">
              <tr><th className="p-3">Staff Details</th><th className="p-3">Department</th><th className="p-3 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {faculties.map(f => (
                <tr key={f._id} className="hover:bg-gray-50">
                  <td className="p-3"><div className="font-bold">{f.name}</div><div className="text-[10px] text-gray-400">{f.email}</div></td>
                  <td className="p-3 font-mono">{f.department}</td>
                  <td className="p-3 text-right"><button onClick={() => dispatch(purgeFacultyRecord(f._id))} className="text-red-500 hover:underline">Purge</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}`,

  'client/src/pages/StudentUpload.jsx': `import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFaculties } from '../redux/slices/facultySlice';
import Navbar from '../components/Navbar';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function StudentUpload() {
  const dispatch = useDispatch();
  const { faculties } = useSelector(state => state.faculty);
  const [facId, setFacId] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => { dispatch(fetchAllFaculties()); }, [dispatch]);

  const onUpload = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('facultyId', facId);
    fd.append('file', file);
    await API.post('/students/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.success('Matrix Ingest Completed.');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="p-6 max-w-md mx-auto bg-white border rounded-xl shadow-xs mt-12">
        <h3 className="font-bold text-sm text-gray-800 mb-3">Bulk Student Excel Onboarding</h3>
        <form onSubmit={onUpload} className="space-y-3">
          <select value={facId} onChange={e=>setFacId(e.target.value)} className="w-full text-xs border p-2 rounded bg-white" required>
            <option value="">Select Faculty Anchor Link</option>
            {faculties.map(f => <option key={f._id} value={f._id}>{f.name} ({f.department})</option>)}
          </select>
          <input type="file" accept=".xlsx" onChange={e=>setFile(e.target.files[0])} className="w-full text-xs" required />
          <button className="w-full bg-blue-600 text-white text-xs py-2 rounded font-medium">Execute Bulk Parsing</button>
        </form>
      </div>
    </div>
  );
}`,

  'client/src/pages/AttendanceCalendar.jsx': `import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function AttendanceCalendar() {
  const { user } = useSelector(state => state.auth);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [batch, setBatch] = useState('');
  const [sem, setSem] = useState('');
  const [students, setStudents] = useState([]);
  const [map, setMap] = useState({});

  const loadRoster = async () => {
    if (!batch || !sem) return;
    const sRes = await API.get(\`/students?facultyId=\${user.id}&batch=\${batch}&semester=\${sem}\`);
    setStudents(sRes.data.data);
    
    const aRes = await API.get(\`/attendance/query?facultyId=\${user.id}&date=\${date}&batch=\${batch}&semesterNumber=\${sem}\`);
    const currentMap = {};
    sRes.data.data.forEach(s => currentMap[s._id] = 'PRESENT');
    if (aRes.data.data) aRes.data.data.records.forEach(r => currentMap[r.studentId._id || r.studentId] = r.status);
    setMap(currentMap);
  };

  useEffect(() => { loadRoster(); }, [date, batch, sem]);

  const onCommit = async () => {
    const recs = Object.keys(map).map(id => ({ studentId: id, status: map[id] }));
    await API.post('/attendance/save', { facultyId: user.id, date, batch, semesterNumber: parseInt(sem), records: recs });
    toast.success('Roster records saved.');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 border border-gray-200 rounded-xl mb-4">
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="text-xs border p-2 rounded" />
          <input placeholder="Batch (e.g. CSE-2024)" value={batch} onChange={e=>setBatch(e.target.value)} className="text-xs border p-2 rounded" />
          <input type="number" placeholder="Semester" value={sem} onChange={e=>setSem(e.target.value)} className="text-xs border p-2 rounded" />
        </div>
        {students.length > 0 && (
          <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
            <div className="divide-y text-xs p-4 space-y-2">
              {students.map(s => (
                <div key={s._id} className="flex justify-between items-center py-2">
                  <div><span className="font-bold">{s.name}</span> <span className="text-gray-400 font-mono">({s.rollNumber})</span></div>
                  <button onClick={() => setMap({...map, [s._id]: map[s._id] === 'PRESENT' ? 'ABSENT' : 'PRESENT'})} className={\`px-4 py-1 rounded-full font-bold uppercase text-[10px] \${map[s._id] === 'PRESENT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}\`}>{map[s._id]}</button>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-3 text-right"><button onClick={onCommit} className="bg-blue-600 text-white font-medium text-xs py-1.5 px-4 rounded">Save Roster Ledger</button></div>
          </div>
        )}
      </div>
    </div>
  );
}`,

  'client/src/pages/AiInsights.jsx': `import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import API from '../services/api';

export default function AiInsights() {
  const { user } = useSelector(state => state.auth);
  const [batch, setBatch] = useState('');
  const [sem, setSem] = useState('');
  const [students, setStudents] = useState([]);
  const [insights, setInsights] = useState(null);

  const lookupRoster = async () => {
    const res = await API.get(\`/students?facultyId=\${user.id}&batch=\${batch}&semester=\${sem}\`);
    setStudents(res.data.data);
  };

  const getInsights = async (id) => {
    const res = await API.get(\`/ai/insights/\${id}\`);
    setInsights(res.data.data);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 border rounded-xl space-y-3 h-fit">
          <input placeholder="Batch" value={batch} onChange={e=>setBatch(e.target.value)} className="w-full text-xs border p-2 rounded" />
          <input type="number" placeholder="Semester" value={sem} onChange={e=>setSem(e.target.value)} className="w-full text-xs border p-2 rounded" />
          <button onClick={lookupRoster} className="w-full bg-purple-600 text-white text-xs py-2 rounded">Sync Stream</button>
          
          {students.length > 0 && (
            <select onChange={e => getInsights(e.target.value)} className="w-full text-xs border p-2 rounded bg-white">
              <option value="">-- Choose Profile Target --</option>
              {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          )}
        </div>
        <div className="md:col-span-2">
          {insights ? (
            <div className="bg-white p-6 border rounded-xl shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-2">{insights.studentName} Matrix Summary</h2>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 p-3 border rounded">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Attendance</div>
                  <div className="text-xl font-black">{insights.attendancePercentage}%</div>
                </div>
                <div className="bg-gray-50 p-3 border rounded">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Consecutive Missed</div>
                  <div className="text-xl font-black">{insights.missedConsecutive}</div>
                </div>
                <div className="bg-gray-50 p-3 border rounded">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">AI Index Score</div>
                  <div className="text-xl font-black text-red-600">{insights.riskIndexPercentage}%</div>
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded border border-purple-100">
                <div className="text-xs font-bold text-purple-900 uppercase">AI Core Strategy Recommendation:</div>
                <p className="text-xs text-purple-700 mt-1 font-medium">{insights.aiRecommendation}</p>
              </div>
            </div>
          ) : <div className="bg-white p-12 text-center text-xs text-gray-400 border rounded-xl">Select active parameters parameters to parse diagnostic data streams.</div>}
        </div>
      </div>
    </div>
  );
}`,

  'client/src/App.jsx': `import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';
import FacultyManagement from './pages/FacultyManagement';
import StudentUpload from './pages/StudentUpload';
import AttendanceCalendar from './pages/AttendanceCalendar';
import AiInsights from './pages/AiInsights';

function ProtectedRoute({ children, role }) {
  const { user } = useSelector(state => state.auth);
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyOtp />} />
          
          <Route path="/admin/faculty" element={<ProtectedRoute role="ADMIN"><FacultyManagement /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute role="ADMIN"><StudentUpload /></ProtectedRoute>} />
          
          <Route path="/faculty/calendar" element={<ProtectedRoute role="FACULTY"><AttendanceCalendar /></ProtectedRoute>} />
          <Route path="/faculty/insights" element={<ProtectedRoute role="FACULTY"><AiInsights /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}`,

  'client/src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900 m-0 p-0;
}`,

  'client/src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,

  'client/index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UniSmart ULMS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,

  'client/vite.config.js': `import { defineConfig } from 'vite'
import collegeReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [collegeReact()],
  server: { port: 5173 }
})`,

  'client/tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,

  'client/postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
};

// Execution logic to build out directories
Object.keys(files).forEach((filePath) => {
  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, files[filePath].trim(), 'utf8');
  console.log(`✓ Created: ${filePath}`);
});

// Explicit required runtime asset clean directories setups
const uploadDir = path.join(process.cwd(), 'server/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

console.log('\n=============================================');
console.log('Project tree populated successfully!');
console.log('Follow previous step commands to spin up server & client environments.');