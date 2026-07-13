import mongoose from 'mongoose';

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
export default Attendance;