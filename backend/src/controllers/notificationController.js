import pool from '../config/db.js';
import { GET_MY_NOTIFICATIONS, MARK_AS_READ, INSERT_NOTIFICATION } from '../queries/notificationQueries.js';

export const createNotification = async (clientOrPool, user_id, message) => {
    try {
        const db = clientOrPool || pool;
        await db.query(INSERT_NOTIFICATION, [user_id, message]);
    } catch (err) {
        console.error('Failed to create notification', err);
    }
};

export const getMyNotifications = async (req, res) => {
    try {
        const result = await pool.query(GET_MY_NOTIFICATIONS, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const result = await pool.query(MARK_AS_READ, [req.params.id, req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
