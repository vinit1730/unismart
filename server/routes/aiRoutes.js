import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { getStudentPredictiveInsights } from '../controllers/aiController.js';
const router = express.Router();
router.get('/insights/:studentId', protect, authorize('ADMIN', 'FACULTY'), getStudentPredictiveInsights);
export default router;