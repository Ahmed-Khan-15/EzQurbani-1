// Step 11 — Payment Queries
// SQL constants for payment processing and receipt generation

export const VERIFY_BOOKING_OWNER = `SELECT user_id FROM BOOKING WHERE booking_id = $1`;

export const INSERT_PAYMENT = `
    INSERT INTO PAYMENT (booking_id, method_id, amount) 
    VALUES ($1, $2, $3) 
    RETURNING *
`;

export const INSERT_RECEIPT = `
    INSERT INTO RECEIPT (payment_id, receipt_no) 
    VALUES ($1, $2) 
    RETURNING *
`;

export const GET_RECEIPT_BY_BOOKING = `
    SELECT r.*, p.amount, p.payment_date 
    FROM RECEIPT r
    JOIN PAYMENT p ON r.payment_id = p.payment_id
    JOIN BOOKING b ON p.booking_id = b.booking_id
    WHERE b.booking_id = $1 AND b.user_id = $2
`;

export const GET_ALL_METHODS = `SELECT * FROM PAYMENT_METHOD`;
