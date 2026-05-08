// Step 11 — Payment Controller
// Logic for processing payments and viewing receipts

import pool from '../config/db.js';
import {
    VERIFY_BOOKING_OWNER,
    INSERT_PAYMENT,
    INSERT_RECEIPT,
    GET_RECEIPT_BY_BOOKING,
    GET_ALL_METHODS
} from '../queries/paymentQueries.js';
import { UPDATE_BOOKING_STATUS } from '../queries/bookingQueries.js';
import { createNotification } from './notificationController.js';

// Get all payment methods
export const getPaymentMethods = async (req, res) => {
    try {
        const result = await pool.query(GET_ALL_METHODS);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Process a payment and generate a receipt
export const makePayment = async (req, res) => {
    const { booking_id, method_id, amount } = req.body;
    const user_id = req.user.id;

    const client = await pool.connect();

    try {
        // 1. Verify Ownership
        const ownershipCheck = await client.query(VERIFY_BOOKING_OWNER, [booking_id]);
        if (ownershipCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (ownershipCheck.rows[0].user_id !== user_id) {
            return res.status(403).json({ message: 'Unauthorized to pay for this booking' });
        }

        await client.query('BEGIN');

        // 2. Insert Payment
        const paymentResult = await client.query(INSERT_PAYMENT, [booking_id, method_id, amount]);
        const newPayment = paymentResult.rows[0];

        // 3. Generate Receipt
        const receiptNo = `RCP-${Date.now()}`;
        const receiptResult = await client.query(INSERT_RECEIPT, [newPayment.payment_id, receiptNo]);
        const newReceipt = receiptResult.rows[0];

        // 4. Update Booking Status to Confirmed
        await client.query(UPDATE_BOOKING_STATUS, ['confirmed', booking_id]);

        await client.query('COMMIT');

        await createNotification(
            pool, 
            user_id, 
            `Payment successful! Your receipt ${receiptNo} has been generated for booking #${booking_id}.`
        );

        res.status(201).json({
            payment: newPayment,
            receipt: newReceipt
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ message: 'Server error during payment' });
    } finally {
        client.release();
    }
};

// Get receipt for a specific booking
export const getReceipt = async (req, res) => {
    const { booking_id } = req.params;
    const user_id = req.user.id;

    try {
        const result = await pool.query(GET_RECEIPT_BY_BOOKING, [booking_id, user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Receipt not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
