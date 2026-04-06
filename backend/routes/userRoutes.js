import express from 'express';
import { createUser, listUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { requireAuth, allowRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createUser);

router.use(requireAuth);
router.get('/', allowRole(['admin']), listUsers);
router.put('/:id', allowRole(['admin']), updateUser);
router.delete('/:id', allowRole(['admin']), deleteUser);

export default router;
