import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { uploadStudentsExcel, getStudents, deleteStudent } from '../controllers/studentController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(protect);
router.post('/upload', authorize('ADMIN'), upload.single('file'), uploadStudentsExcel);
router.get('/', authorize('ADMIN', 'FACULTY'), getStudents);
router.delete('/:id', authorize('ADMIN'), deleteStudent);
export default router;