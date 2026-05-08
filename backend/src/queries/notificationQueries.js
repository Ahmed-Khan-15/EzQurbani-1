export const GET_MY_NOTIFICATIONS = `
    SELECT * FROM NOTIFICATION
    WHERE user_id = $1
    ORDER BY created_at DESC
`;

export const MARK_AS_READ = `
    UPDATE NOTIFICATION SET is_read = TRUE
    WHERE notification_id = $1 AND user_id = $2
    RETURNING *
`;

export const INSERT_NOTIFICATION = `
    INSERT INTO NOTIFICATION (user_id, message)
    VALUES ($1, $2)
    RETURNING *
`;
