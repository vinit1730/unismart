import ExcelJS from 'exceljs';
import fs from 'fs';
import Student from '../models/Student.js';

export const uploadStudentsExcel = async (req, res) => {
  try {
    console.log("===== uploadStudentsExcel called =====");
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const { facultyId } = req.body;

    if (!req.file || !facultyId) {
      return res.status(400).json({
        success: false,
        message: "Parameters missing."
      });
    }

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(req.file.path);

    const ws = wb.worksheets[0];

    const records = [];

    ws.eachRow((row, index) => {
      if (index === 1) return;

      const student = {
        name: row.getCell(1).text.trim(),
        rollNumber: row.getCell(2).text.trim().toUpperCase(),
        email: row.getCell(3).text.trim().toLowerCase(),
        batch: row.getCell(4).text.trim(),
        semesterNumber: Number(row.getCell(5).text),
        facultyId
      };

      console.log("Parsed Student:", student);

      records.push(student);
    });

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    let count = 0;

    for (const s of records) {

      if (!s.rollNumber || !s.email) {
        console.log("Skipping Invalid Student:", s);
        continue;
      }

      const exist = await Student.findOne({
        $or: [
          { rollNumber: s.rollNumber },
          { email: s.email }
        ]
      });

      if (exist) {
        console.log("Student already exists:", s.rollNumber);
        continue;
      }

      await Student.create(s);

      console.log("Inserted:", s.rollNumber);

      count++;
    }

    console.log(`Import completed. Total inserted = ${count}`);

    return res.status(200).json({
      success: true,
      message: `Import complete. Onboarded: ${count}`
    });

  } catch (err) {

    console.error("Upload Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

export const getStudents = async (req, res) => {
  try {

    const filters = {};

    if (req.query.facultyId)
      filters.facultyId = req.query.facultyId;

    if (req.query.batch)
      filters.batch = req.query.batch;

    if (req.query.semester)
      filters.semesterNumber = Number(req.query.semester);

    console.log("Fetching students with filters:", filters);

    const data = await Student.find(filters).sort({
      rollNumber: 1
    });

    console.log(`Students Found: ${data.length}`);

    res.status(200).json({
      success: true,
      data
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

export const deleteStudent = async (req, res) => {
  try {

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};