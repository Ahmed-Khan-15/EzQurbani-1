-- Step 4 — Sample Queries for Lab Reports & Viva
-- This file contains queries categorized by lab topic.

-- ==========================================
-- 1. Basic SELECT with WHERE
-- ==========================================

-- Show all available animals
SELECT * FROM ANIMAL WHERE status = 'available';

-- Show bookings that are still pending
SELECT * FROM BOOKING WHERE status = 'pending';

-- Show all animals in the 'Cow' category (assuming category_id 2 is Cow)
SELECT * FROM ANIMAL WHERE category_id = 2;


-- ==========================================
-- 2. INNER JOIN
-- ==========================================

-- Show bookings with customer names and email
SELECT b.booking_id, p.name, p.email, b.total_amount
FROM BOOKING b
INNER JOIN PERSON p ON b.user_id = p.person_id;

-- Show animals with their category names and vendor names
SELECT a.tag_no, ac.name AS category, v.name AS vendor
FROM ANIMAL a
INNER JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
INNER JOIN VENDOR v ON a.vendor_id = v.vendor_id;

-- Show payments with their booking status
SELECT p.payment_id, p.amount, b.status AS booking_status
FROM PAYMENT p
INNER JOIN BOOKING b ON p.booking_id = b.booking_id;


-- ==========================================
-- 3. LEFT JOIN
-- ==========================================

-- Show all animals and their booking details (including animals not yet booked)
SELECT a.tag_no, b.booking_id, b.status
FROM ANIMAL a
LEFT JOIN BOOKING b ON a.animal_id = b.animal_id;

-- Show all users and their reviews (including users who haven't written a review)
SELECT p.name, r.rating, r.comment
FROM PERSON p
INNER JOIN "USER" u ON p.person_id = u.user_id
LEFT JOIN REVIEW r ON u.user_id = r.user_id;

-- Show all slaughterhouses and their assigned butchers
SELECT sh.name AS house, b.name AS butcher
FROM SLAUGHTER_HOUSE sh
LEFT JOIN BUTCHER b ON sh.house_id = b.house_id;


-- ==========================================
-- 4. GROUP BY + HAVING
-- ==========================================

-- Total number of bookings per user
SELECT user_id, COUNT(booking_id) AS total_bookings
FROM BOOKING
GROUP BY user_id;

-- Total revenue generated per payment method
SELECT pm.name, SUM(p.amount) AS total_revenue
FROM PAYMENT p
INNER JOIN PAYMENT_METHOD pm ON p.method_id = pm.method_id
GROUP BY pm.name;

-- Animal categories that have more than 2 animals available
SELECT ac.name, COUNT(a.animal_id) AS animal_count
FROM ANIMAL a
INNER JOIN ANIMAL_CATEGORY ac ON a.category_id = ac.category_id
WHERE a.status = 'available'
GROUP BY ac.name
HAVING COUNT(a.animal_id) > 2;


-- ==========================================
-- 5. Subqueries
-- ==========================================

-- Find animals whose price is higher than the average price of all animals
SELECT tag_no, price
FROM ANIMAL
WHERE price > (SELECT AVG(price) FROM ANIMAL);

-- Find users who have never made a booking
SELECT name, email
FROM PERSON
WHERE person_id IN (SELECT user_id FROM "USER")
AND person_id NOT IN (SELECT user_id FROM BOOKING);

-- Find the most expensive animal in each category using a correlated subquery
SELECT a1.tag_no, a1.price, ac.name
FROM ANIMAL a1
JOIN ANIMAL_CATEGORY ac ON a1.category_id = ac.category_id
WHERE a1.price = (
    SELECT MAX(a2.price)
    FROM ANIMAL a2
    WHERE a2.category_id = a1.category_id
);


-- ==========================================
-- 6. Aggregate Functions
-- ==========================================

-- Calculate total revenue from all payments
SELECT SUM(amount) AS total_revenue FROM PAYMENT;

-- Count total available hissas across all animals
SELECT COUNT(*) AS available_hissas FROM HISSA WHERE status = 'available';

-- Find the minimum, maximum, and average weight of animals
SELECT MIN(weight) AS min_weight, MAX(weight) AS max_weight, AVG(weight) AS avg_weight 
FROM ANIMAL;


-- ==========================================
-- 7. INSERT / UPDATE / DELETE
-- ==========================================

-- Insert a new discount code
INSERT INTO DISCOUNT (code, percentage, expiry_date) 
VALUES ('FLASH20', 20.0, '2026-05-31');

-- Update delivery status for a specific order
UPDATE DELIVERY_ORDER SET status = 'out_for_delivery' WHERE delivery_id = 1;

-- Delete an expired notification
DELETE FROM NOTIFICATION WHERE created_at < '2026-01-01';
