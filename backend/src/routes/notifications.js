import express from 'express';
import { getMyNotifications, markAsRead } from '../controllers/notificationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', verifyToken, getMyNotifications);
router.patch('/:id/read', verifyToken, markAsRead);

export default router;
