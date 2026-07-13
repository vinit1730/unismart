import Attendance from '../models/Attendance.js';
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
};