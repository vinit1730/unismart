import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { saveAttendance, getAttendanceByFilter, downloadAttendanceReport } from '../controllers/attendanceController.js';
const router = express.Router();
router.use(protect);
router.post('/save', authorize('FACULTY'), saveAttendance);
router.get('/query', authorize('FACULTY', 'ADMIN'), getAttendanceByFilter);
router.get('/report', authorize('FACULTY', 'ADMIN'), downloadAttendanceReport);
export default router;