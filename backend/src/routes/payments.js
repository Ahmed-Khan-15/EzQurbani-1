// Step 11 — Payment Routes
// Endpoints for /api/payments

import express from 'express';
import {
    getPaymentMethods,
    makePayment,
    getReceipt
} from '../controllers/paymentController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/methods', getPaymentMethods);
router.post('/', verifyToken, makePayment);
router.get('/receipt/:booking_id', verifyToken, getReceipt);

export default router;
