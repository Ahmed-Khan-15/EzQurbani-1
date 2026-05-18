SELECT
    p.person_id,
    p.name AS person_name,
    p.email,
    p.phone,

    u.user_id,
    a.admin_id,
    a.admin_level,

    addr.address_id,
    addr.address_line,
    addr.is_default,
    city_addr.name AS address_city,

    b.booking_id,
    b.booking_type,
    b.total_amount,
    b.status AS booking_status,
    b.created_at AS booking_created_at,

    animal.animal_id,
    animal.tag_no,
    animal.weight,
    animal.price AS animal_price,
    animal.status AS animal_status,
    ac.name AS category_name,

    vendor.vendor_id,
    vendor.name AS vendor_name,
    vendor.contact AS vendor_contact,
    city_vendor.name AS vendor_city,

    hr.health_status,
    hr.last_checkup,

    h.hissa_id,
    h.hissa_no,
    h.price AS hissa_price,
    h.status AS hissa_status,

    d.discount_id,
    d.code AS discount_code,
    d.percentage,
    d.expiry_date,

    pay.payment_id,
    pay.amount AS paid_amount,
    pay.payment_date,
    pm.name AS payment_method,

    r.receipt_id,
    r.receipt_no,
    r.issued_at AS receipt_issued_at,

    mp.package_id,
    mp.weight AS package_weight,
    mp.status AS package_status,

    del.delivery_id,
    del.delivery_date,
    del.status AS delivery_status,
    da.name AS delivery_agent_name,
    da.contact AS delivery_agent_contact,

    ss.schedule_id,
    ss.slaughter_date,
    ss.slaughter_time,
    ss.status AS slaughter_status,

    sh.house_id,
    sh.name AS slaughter_house,
    sh.location AS slaughter_house_location,
    city_house.name AS slaughter_city,

    but.butcher_id,
    but.name AS butcher_name,
    but.contact AS butcher_contact,

    notif.notification_id,
    notif.message AS notification_message,
    notif.is_read,
    notif.created_at AS notification_created_at,

    rev.review_id,
    rev.rating,
    rev.comment AS review_comment,
    rev.created_at AS review_created_at
FROM PERSON p
LEFT JOIN "USER" u ON p.person_id = u.user_id
LEFT JOIN ADMIN a ON p.person_id = a.admin_id
LEFT JOIN ADDRESS addr ON u.user_id = addr.user_id
LEFT JOIN CITY city_addr ON addr.city_id = city_addr.city_id

LEFT JOIN BOOKING b ON u.user_id = b.user_id
LEFT JOIN DISCOUNT d ON b.discount_id = d.discount_id
LEFT JOIN ANIMAL animal ON b.animal_id = animal.animal_id
LEFT JOIN ANIMAL_CATEGORY ac ON animal.category_id = ac.category_id
LEFT JOIN VENDOR vendor ON animal.vendor_id = vendor.vendor_id
LEFT JOIN CITY city_vendor ON vendor.city_id = city_vendor.city_id
LEFT JOIN ANIMAL_HEALTH_RECORD hr ON animal.animal_id = hr.animal_id
LEFT JOIN HISSA h ON b.hissa_id = h.hissa_id

LEFT JOIN PAYMENT pay ON b.booking_id = pay.booking_id
LEFT JOIN PAYMENT_METHOD pm ON pay.method_id = pm.method_id
LEFT JOIN RECEIPT r ON pay.payment_id = r.payment_id

LEFT JOIN MEAT_PACKAGE mp ON b.booking_id = mp.booking_id
LEFT JOIN DELIVERY_ORDER del ON mp.package_id = del.package_id
LEFT JOIN DELIVERY_AGENT da ON del.agent_id = da.agent_id

LEFT JOIN SLAUGHTER_SCHEDULE ss ON animal.animal_id = ss.animal_id
LEFT JOIN SLAUGHTER_HOUSE sh ON ss.house_id = sh.house_id
LEFT JOIN CITY city_house ON sh.city_id = city_house.city_id
LEFT JOIN BUTCHER but ON ss.butcher_id = but.butcher_id

LEFT JOIN NOTIFICATION notif ON u.user_id = notif.user_id
LEFT JOIN REVIEW rev ON u.user_id = rev.user_id;