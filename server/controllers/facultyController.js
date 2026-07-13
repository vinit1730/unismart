import Faculty from '../models/Faculty.js';

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
};