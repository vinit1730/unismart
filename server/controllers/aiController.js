import { spawn } from 'child_process';
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
};