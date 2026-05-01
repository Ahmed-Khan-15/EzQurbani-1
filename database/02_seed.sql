-- Step 2 — Seed Data for EzQurbani
-- This file populates the database with initial records for testing.

-- 1. Cities
INSERT INTO CITY (name) VALUES 
('Karachi'), 
('Lahore'), 
('Islamabad');

-- 2. Animal Categories
INSERT INTO ANIMAL_CATEGORY (name) VALUES 
('Bakra'), 
('Cow'), 
('Dumba'), 
('Camel');

-- 3. Vendors
INSERT INTO VENDOR (name, contact, city_id) VALUES 
('Ali Cattle Farm', '0300-1112223', 1),
('Punjab Livestock', '0321-4445556', 2),
('Northern Grazers', '0311-7778889', 3);

-- 4. Persons (Passwords are 'password123' hashed)
-- Admin
INSERT INTO PERSON (name, email, password, phone) VALUES 
('System Admin', 'admin@qms.com', '$2a$10$7R9CAIdiaSre9jLGYM9u9uYvQ.8mI.eB1eB1eB1eB1eB1eB1eB1eB1eB1', '0345-0000000');
-- Users
INSERT INTO PERSON (name, email, password, phone) VALUES 
('Muhammad Umar', 'umar@gmail.com', '$2a$10$7R9CAIdiaSre9jLGYM9u9uYvQ.8mI.eB1eB1eB1eB1eB1eB1eB1eB1eB1', '0333-1234567'),
('Ahmed Khan', 'ahmed@yahoo.com', '$2a$10$7R9CAIdiaSre9jLGYM9u9uYvQ.8mI.eB1eB1eB1eB1eB1eB1eB1eB1eB1', '0322-9876543'),
('Sara Ali', 'sara@outlook.com', '$2a$10$7R9CAIdiaSre9jLGYM9u9uYvQ.8mI.eB1eB1eB1eB1eB1eB1eB1eB1eB1', '0311-5554443');

-- 5. Users and Admins
INSERT INTO ADMIN (admin_id, admin_level) VALUES (1, 'superadmin');
INSERT INTO "USER" (user_id) VALUES (2), (3), (4);

-- 6. Addresses
INSERT INTO ADDRESS (user_id, city_id, address_line, is_default) VALUES 
(2, 1, 'House 123, Block 5, Gulshan-e-Iqbal', TRUE),
(3, 2, 'Apartment 4B, Model Town', TRUE),
(4, 3, 'Street 10, Sector F-7/2', TRUE);

-- 7. Animals
INSERT INTO ANIMAL (category_id, vendor_id, tag_no, weight, price, status) VALUES 
(1, 1, 'TAG-B01', 45.0, 65000.0, 'available'),
(1, 1, 'TAG-B02', 50.5, 75000.0, 'available'),
(2, 2, 'TAG-C01', 280.0, 210000.0, 'available'), -- Cow 1 for hissas
(2, 2, 'TAG-C02', 310.0, 245000.0, 'available'), -- Cow 2 for hissas
(3, 3, 'TAG-D01', 35.0, 55000.0, 'available'),
(4, 1, 'TAG-CM1', 450.0, 450000.0, 'available'),
(2, 2, 'TAG-C03', 250.0, 195000.0, 'available'),
(1, 3, 'TAG-B03', 48.0, 70000.0, 'available');

-- 8. Animal Health Records
INSERT INTO ANIMAL_HEALTH_RECORD (animal_id, health_status) VALUES 
(1, 'Healthy - Vaccinated'),
(2, 'Healthy - All Clear'),
(3, 'Fit for Qurbani'),
(4, 'Fit for Qurbani'),
(5, 'Healthy'),
(6, 'Excellent Condition'),
(7, 'Healthy'),
(8, 'Healthy');

-- 9. Hissas (Dividing Cow 1 and Cow 2 into 7 shares each)
-- Cow 1 (animal_id 3)
INSERT INTO HISSA (animal_id, hissa_no, price, status) VALUES 
(3, 1, 30000.0, 'available'), (3, 2, 30000.0, 'available'), (3, 3, 30000.0, 'available'),
(3, 4, 30000.0, 'available'), (3, 5, 30000.0, 'available'), (3, 6, 30000.0, 'available'),
(3, 7, 30000.0, 'available');
-- Cow 2 (animal_id 4)
INSERT INTO HISSA (animal_id, hissa_no, price, status) VALUES 
(4, 1, 35000.0, 'available'), (4, 2, 35000.0, 'available'), (4, 3, 35000.0, 'available'),
(4, 4, 35000.0, 'available'), (4, 5, 35000.0, 'available'), (4, 6, 35000.0, 'available'),
(4, 7, 35000.0, 'available');

-- 10. Payment Methods
INSERT INTO PAYMENT_METHOD (name) VALUES 
('Cash'), 
('Easypaisa'), 
('Bank Transfer'), 
('Credit Card');

-- 11. Discounts
INSERT INTO DISCOUNT (code, percentage, expiry_date) VALUES 
('EID2026', 10.0, '2026-06-30'),
('WELCOME5', 5.0, '2026-12-31');

-- 12. Bookings
-- User 2 books a Bakra (Animal 1) - Full
INSERT INTO BOOKING (user_id, animal_id, booking_type, total_amount, status) VALUES 
(2, 1, 'full', 65000.0, 'confirmed');
-- User 3 books 2 Hissas of Cow 1 (Hissa 1 and 2)
INSERT INTO BOOKING (user_id, animal_id, hissa_id, booking_type, total_amount, status) VALUES 
(3, 3, 1, 'hissa', 30000.0, 'confirmed'),
(3, 3, 2, 'hissa', 30000.0, 'confirmed');
-- Update hissa status manually for now (Trigger will handle this later)
UPDATE HISSA SET status = 'booked' WHERE hissa_id IN (1, 2);
UPDATE ANIMAL SET status = 'booked' WHERE animal_id = 1;

-- 13. Payments and Receipts
INSERT INTO PAYMENT (booking_id, method_id, amount) VALUES 
(1, 2, 65000.0),
(2, 3, 30000.0);
INSERT INTO RECEIPT (payment_id, receipt_no) VALUES 
(1, 'RCP-10001'),
(2, 'RCP-10002');

-- 14. Slaughterhouse and Butchers
INSERT INTO SLAUGHTER_HOUSE (name, city_id, location) VALUES 
('Central Abattoir Karachi', 1, 'Korangi Industrial Area'),
('Lahore Meat Processing', 2, 'Shahdara');
INSERT INTO BUTCHER (name, contact, house_id) VALUES 
('Haji Rafiq', '0344-9998887', 1),
('Sajid Qasai', '0322-7776665', 2);

-- 15. Slaughter Schedule
INSERT INTO SLAUGHTER_SCHEDULE (animal_id, house_id, butcher_id, slaughter_date, slaughter_time, status) VALUES 
(1, 1, 1, '2026-06-16', '08:00:00', 'completed');

-- 16. Meat Packages and Deliveries
INSERT INTO MEAT_PACKAGE (booking_id, weight, status) VALUES 
(1, 22.5, 'delivered');
INSERT INTO DELIVERY_AGENT (name, contact) VALUES 
('Bykea Delivery', '021-111222333'),
('Foodpanda Pro', '021-444555666');
INSERT INTO DELIVERY_ORDER (package_id, agent_id, address_id, delivery_date, status) VALUES 
(1, 1, 1, '2026-06-16', 'delivered');

-- 17. Notifications and Reviews
INSERT INTO NOTIFICATION (user_id, message) VALUES 
(2, 'Your booking for TAG-B01 is confirmed.'),
(3, 'Your hissa booking for Cow 1 is confirmed.');
INSERT INTO REVIEW (user_id, animal_id, rating, comment) VALUES 
(2, 1, 5, 'Excellent service and healthy animal. Highly recommended!');
