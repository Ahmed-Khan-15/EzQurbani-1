import pool from '../config/db.js';
import { INSERT_REVIEW } from '../queries/reviewQueries.js';

export const createReview = async (req, res) => {
    const { animal_id, rating, comment } = req.body;
    const user_id = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Valid rating between 1 and 5 is required' });
    }

    try {
        const result = await pool.query(INSERT_REVIEW, [user_id, animal_id, rating, comment || null]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error while submitting review' });
    }
};
