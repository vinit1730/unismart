import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  department: { type: String, required: true, trim: true },
  academicYear: { type: String, required: true, trim: true },
  designation: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Faculty = mongoose.model('Faculty', facultySchema);
export default Faculty;