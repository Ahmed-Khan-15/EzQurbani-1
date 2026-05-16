// Step 13 — Delivery Queries
// SQL constants for packaging and delivery management

export const INSERT_DELIVERY_ORDER = `
    INSERT INTO DELIVERY_ORDER (package_id, agent_id, address_id, delivery_date, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
`;

export const TRACK_DELIVERY_BY_BOOKING = `
    SELECT 
        b.booking_id, 
        b.status as booking_status,
        ss.status as slaughter_status,
        mp.status as package_status,
        d.status as delivery_status,
        d.delivery_date,
        a.name as agent_name,
        ad.address_line
    FROM BOOKING b
    LEFT JOIN SLAUGHTER_SCHEDULE ss ON b.animal_id = ss.animal_id
    LEFT JOIN MEAT_PACKAGE mp ON b.booking_id = mp.booking_id
    LEFT JOIN DELIVERY_ORDER d ON mp.package_id = d.package_id
    LEFT JOIN DELIVERY_AGENT a ON d.agent_id = a.agent_id
    LEFT JOIN ADDRESS ad ON b.address_id = ad.address_id
    WHERE b.booking_id = $1 AND b.user_id = $2
`;

export const UPDATE_DELIVERY_STATUS = `
    UPDATE DELIVERY_ORDER SET status = $1 WHERE delivery_id = $2
    RETURNING *
`;

export const GET_ALL_DELIVERIES = `
    SELECT d.*, a.name as agent_name, ad.address_line, mp.weight as package_weight
    FROM DELIVERY_ORDER d
    JOIN MEAT_PACKAGE mp ON d.package_id = mp.package_id
    LEFT JOIN DELIVERY_AGENT a ON d.agent_id = a.agent_id
    LEFT JOIN ADDRESS ad ON d.address_id = ad.address_id
`;

export const GET_ALL_AGENTS = `SELECT * FROM DELIVERY_AGENT`;

export const GET_PENDING_BOOKINGS_FOR_DELIVERY = `
    SELECT b.booking_id, p.name as customer_name, a.tag_no, ac.name as animal_category,
           (SELECT address_id FROM ADDRESS WHERE user_id = b.user_id LIMIT 1) as address_id
    FROM BOOKING b
    JOIN PERSON p ON b.user_id = p.person_id
    LEFT JOIN ANIMAL a ON b.animal_id = a.animal_id
    LEFT JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
    WHERE b.status = 'confirmed' 
      AND NOT EXISTS (
          SELECT 1 FROM MEAT_PACKAGE mp WHERE mp.booking_id = b.booking_id
      )
`;

export const INSERT_MEAT_PACKAGE = `
    INSERT INTO MEAT_PACKAGE (booking_id, weight, status)
    VALUES ($1, $2, $3)
    RETURNING *
`;
