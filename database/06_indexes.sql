-- Step 6 — Database Indexes for EzQurbani
-- These indexes optimize the most frequent search and join operations.

-- Index for User and Animal IDs in Booking (Frequent filtering and joins)
CREATE INDEX idx_booking_user_id ON BOOKING(user_id);
CREATE INDEX idx_booking_animal_id ON BOOKING(animal_id);

-- Index for Animal Category and Vendor (Frequent filtering in browsing)
CREATE INDEX idx_animal_category_id ON ANIMAL(category_id);
CREATE INDEX idx_animal_vendor_id ON ANIMAL(vendor_id);

-- Index for Hissa's parent animal (Joins)
CREATE INDEX idx_hissa_animal_id ON HISSA(animal_id);

-- Index for Payments by Booking (Joins)
CREATE INDEX idx_payment_booking_id ON PAYMENT(booking_id);

-- Index for Delivery Orders by Package (Joins)
CREATE INDEX idx_delivery_package_id ON DELIVERY_ORDER(package_id);

-- Index for Notifications by User (Filtering)
CREATE INDEX idx_notification_user_id ON NOTIFICATION(user_id);

-- Index for Reviews by Animal (Filtering)
CREATE INDEX idx_review_animal_id ON REVIEW(animal_id);
