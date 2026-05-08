// Step 10 — Booking Controller
// Logic for creating and managing bookings

import pool from '../config/db.js';
import {
    CHECK_ANIMAL_AVAILABLE,
    CHECK_HISSA_AVAILABLE,
    INSERT_BOOKING,
    UPDATE_HISSA_STATUS,
    UPDATE_ANIMAL_STATUS,
    GET_MY_BOOKINGS,
    GET_ALL_BOOKINGS,
    UPDATE_BOOKING_STATUS,
    INSERT_ADDRESS
} from '../queries/bookingQueries.js';
import { createNotification } from './notificationController.js';

// Create a new booking (Most Important Function)
export const createBooking = async (req, res) => {
    const { animal_id, hissa_ids, discount_id, booking_type, total_amount, qurbani_day, delivery_preference, address_line, city_id } = req.body;
    const user_id = req.user.id;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Availability and Rule Check
        if (booking_type === 'hissa') {
            if (delivery_preference === 'deliver_alive') {
                return res.status(400).json({ message: 'Whole animal delivery is only available for full bookings' });
            }
            if (!hissa_ids || hissa_ids.length === 0) throw new Error('At least one Hissa ID is required');
            
            // Check all hissas
            for (const id of hissa_ids) {
                const hissaCheck = await client.query(CHECK_HISSA_AVAILABLE, [id]);
                if (hissaCheck.rows.length === 0 || hissaCheck.rows[0].status !== 'available') {
                    await client.query('ROLLBACK');
                    return res.status(400).json({ message: `Hissa #${id} is no longer available` });
                }
            }
        } else {
            const animalCheck = await client.query(CHECK_ANIMAL_AVAILABLE, [animal_id]);
            if (animalCheck.rows.length === 0 || animalCheck.rows[0].status !== 'available') {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Animal is no longer available for full booking' });
            }
        }

        // 2. Insert Address if needed
        let address_id = null;
        if (delivery_preference !== 'pickup' && address_line) {
            const addressResult = await client.query(INSERT_ADDRESS, [
                user_id,
                city_id || 1,
                address_line
            ]);
            address_id = addressResult.rows[0].address_id;
        }

        const createdBookings = [];

        // 3. Insert Bookings
        if (booking_type === 'hissa') {
            // Divide total amount equally among hissas if total_amount is the grand total
            const pricePerHissa = total_amount / hissa_ids.length;

            for (const id of hissa_ids) {
                const bookingResult = await client.query(INSERT_BOOKING, [
                    user_id,
                    animal_id,
                    id,
                    discount_id || null,
                    booking_type,
                    pricePerHissa,
                    'pending',
                    qurbani_day || null,
                    delivery_preference || null,
                    address_id
                ]);
                createdBookings.push(bookingResult.rows[0]);
                await client.query(UPDATE_HISSA_STATUS, ['booked', id]);
            }
        } else {
            const bookingResult = await client.query(INSERT_BOOKING, [
                user_id,
                animal_id,
                null,
                discount_id || null,
                booking_type,
                total_amount,
                'pending',
                qurbani_day || null,
                delivery_preference || null,
                address_id
            ]);
            createdBookings.push(bookingResult.rows[0]);
            await client.query(UPDATE_ANIMAL_STATUS, ['booked', animal_id]);
        }

        await client.query('COMMIT');

        // Create notification
        await createNotification(
            pool, 
            user_id, 
            `Your ${booking_type === 'hissa' ? `${hissa_ids.length} Hissa(s)` : 'Full Animal'} booking has been confirmed successfully!`
        );

        res.status(201).json(booking_type === 'hissa' ? createdBookings : createdBookings[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Server error during booking' });
    } finally {
        client.release();
    }
};

// Get current user's bookings
export const getMyBookings = async (req, res) => {
    try {
        const result = await pool.query(GET_MY_BOOKINGS, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all bookings (Admin only)
export const getAllBookings = async (req, res) => {
    try {
        const result = await pool.query(GET_ALL_BOOKINGS);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update booking status (Admin only)
export const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const result = await pool.query(UPDATE_BOOKING_STATUS, [status, req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Cancel booking (Customer)
export const cancelBooking = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const checkResult = await pool.query('SELECT status, created_at, hissa_id, animal_id FROM BOOKING WHERE booking_id = $1 AND user_id = $2', [id, user_id]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found or unauthorized' });
        }

        const booking = checkResult.rows[0];

        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
        }

        // Validate 7-day rule (May 26, 2026 is Eid)
        const deadline = new Date('2026-05-19T23:59:59Z');
        const now = new Date(); // Mockable or current date

        if (now > deadline) {
            return res.status(400).json({ message: 'Cancellation period has ended (must be 7 days before Eid).' });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(
                'UPDATE BOOKING SET status = $1 WHERE booking_id = $2 RETURNING *',
                ['cancelled', id]
            );

            // Free up the animal or hissa
            if (booking.hissa_id) {
                await client.query(UPDATE_HISSA_STATUS, ['available', booking.hissa_id]);
            } else if (booking.animal_id) {
                await client.query(UPDATE_ANIMAL_STATUS, ['available', booking.animal_id]);
            }

            await client.query('COMMIT');

            await createNotification(
                pool, 
                user_id, 
                `Your booking #${id} has been successfully cancelled.`
            );

            res.json(result.rows[0]);
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error during cancellation' });
    }
};
