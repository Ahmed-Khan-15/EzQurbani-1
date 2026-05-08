export const INSERT_REVIEW = `
    INSERT INTO REVIEW (user_id, animal_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *
`;
