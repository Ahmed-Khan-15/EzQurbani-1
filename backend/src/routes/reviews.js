import express from 'express';
import { createReview } from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createReview);

export default router;
