import mongoose from 'mongoose';

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
export default Student;