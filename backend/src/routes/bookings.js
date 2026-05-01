// Step 10 — Booking Routes
// Endpoints for /api/bookings

import express from 'express';
import {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus
} from '../controllers/bookingController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/', verifyToken, createBooking);
router.get('/my', verifyToken, getMyBookings);

// Admin routes
router.get('/', verifyToken, requireAdmin, getAllBookings);
router.patch('/:id/status', verifyToken, requireAdmin, updateBookingStatus);

export default router;
