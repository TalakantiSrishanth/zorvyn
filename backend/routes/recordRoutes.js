import express from 'express';
import {
  createRecord,
  fetchRecords,
  loadRecordById,
  updateRecord,
  deleteRecord
} from '../controllers/recordController.js';
import { requireAuth, allowRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', allowRole(['analyst', 'admin']), fetchRecords);
router.get('/:id', allowRole(['analyst', 'admin']), loadRecordById);

router.post('/', allowRole(['analyst', 'admin']), createRecord);
router.put('/:id', allowRole(['analyst', 'admin']), updateRecord);

router.delete('/:id', allowRole(['admin']), deleteRecord);

export default router;
