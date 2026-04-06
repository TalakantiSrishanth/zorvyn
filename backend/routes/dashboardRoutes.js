import express from 'express';
import { loadDashboardSummary } from '../controllers/dashboardController.js';
import { requireAuth, allowRole } from '../middleware/auth.js';

const router = express.Router();

router.get(
  '/summary',
  requireAuth,
  allowRole(['viewer', 'analyst', 'admin']),
  loadDashboardSummary
);

export default router;
