-- Step 5 — Stored Functions and Triggers for EzQurbani
-- These objects implement business logic at the database level.

-- 1. Function: check_hissa_availability
-- Returns TRUE if the hissa is 'available'
CREATE OR REPLACE FUNCTION check_hissa_availability(target_hissa_id INT)
RETURNS BOOLEAN AS $$
DECLARE
    is_available BOOLEAN;
BEGIN
    SELECT (status = 'available') INTO is_available
    FROM HISSA
    WHERE hissa_id = target_hissa_id;
    
    RETURN COALESCE(is_available, FALSE);
END;
$$ LANGUAGE plpgsql;

-- 2. Function: get_user_bookings
-- Returns a table of bookings for a specific user using the view
CREATE OR REPLACE FUNCTION get_user_bookings(uid INT)
RETURNS SETOF customer_booking_view AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM customer_booking_view WHERE user_id = uid;
END;
$$ LANGUAGE plpgsql;

-- 3. Function: calculate_total_revenue
-- Returns the sum of all confirmed payments
CREATE OR REPLACE FUNCTION calculate_total_revenue()
RETURNS NUMERIC AS $$
BEGIN
    RETURN (SELECT SUM(amount) FROM PAYMENT);
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger Function: auto_update_status_after_booking
-- Updates Animal or Hissa status to 'booked' automatically
CREATE OR REPLACE FUNCTION auto_update_status_after_booking()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_type = 'hissa' AND NEW.hissa_id IS NOT NULL THEN
        UPDATE HISSA SET status = 'booked' WHERE hissa_id = NEW.hissa_id;
    ELSIF NEW.booking_type = 'full' AND NEW.animal_id IS NOT NULL THEN
        UPDATE ANIMAL SET status = 'booked' WHERE animal_id = NEW.animal_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger: trg_auto_book
DROP TRIGGER IF EXISTS trg_auto_book ON BOOKING;
CREATE TRIGGER trg_auto_book
AFTER INSERT ON BOOKING
FOR EACH ROW
EXECUTE FUNCTION auto_update_status_after_booking();
