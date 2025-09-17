-- Add sample room units with specific codes
INSERT INTO public.room_units (room_id, code, status) VALUES
-- Standard Room units
((SELECT id FROM rooms WHERE type = 'standard'), 'SR1', 'available'),
((SELECT id FROM rooms WHERE type = 'standard'), 'SR2', 'available'),
((SELECT id FROM rooms WHERE type = 'standard'), 'SR3', 'available'),
((SELECT id FROM rooms WHERE type = 'standard'), 'SR4', 'available'),
((SELECT id FROM rooms WHERE type = 'standard'), 'SR5', 'available'),

-- Deluxe Room units  
((SELECT id FROM rooms WHERE type = 'deluxe'), 'DR1', 'available'),
((SELECT id FROM rooms WHERE type = 'deluxe'), 'DR2', 'available'),
((SELECT id FROM rooms WHERE type = 'deluxe'), 'DR3', 'available'),
((SELECT id FROM rooms WHERE type = 'deluxe'), 'DR4', 'available'),

-- Presidential Suite units
((SELECT id FROM rooms WHERE type = 'suite'), 'PS1', 'available'),
((SELECT id FROM rooms WHERE type = 'suite'), 'PS2', 'available'),
((SELECT id FROM rooms WHERE type = 'suite'), 'PS3', 'available');

-- Add sample room images with multiple images per room
INSERT INTO public.room_images (room_id, image_url, alt, sort_order) VALUES
-- Standard Room images
((SELECT id FROM rooms WHERE type = 'standard'), '/src/assets/room-standard.jpg', 'Standard Room Main View', 1),
((SELECT id FROM rooms WHERE type = 'standard'), '/src/assets/room-standard.jpg', 'Standard Room Bedroom', 2),
((SELECT id FROM rooms WHERE type = 'standard'), '/src/assets/room-standard.jpg', 'Standard Room Bathroom', 3),
((SELECT id FROM rooms WHERE type = 'standard'), '/src/assets/room-standard.jpg', 'Standard Room Work Area', 4),

-- Deluxe Room images
((SELECT id FROM rooms WHERE type = 'deluxe'), '/src/assets/room-deluxe.jpg', 'Deluxe Room Main View', 1),
((SELECT id FROM rooms WHERE type = 'deluxe'), '/src/assets/room-deluxe.jpg', 'Deluxe Room Bedroom', 2),
((SELECT id FROM rooms WHERE type = 'deluxe'), '/src/assets/room-deluxe.jpg', 'Deluxe Room Marble Bathroom', 3),
((SELECT id FROM rooms WHERE type = 'deluxe'), '/src/assets/room-deluxe.jpg', 'Deluxe Room City View', 4),
((SELECT id FROM rooms WHERE type = 'deluxe'), '/src/assets/room-deluxe.jpg', 'Deluxe Room Minibar Area', 5),

-- Presidential Suite images
((SELECT id FROM rooms WHERE type = 'suite'), '/src/assets/room-suite.jpg', 'Presidential Suite Main View', 1),
((SELECT id FROM rooms WHERE type = 'suite'), '/src/assets/room-suite.jpg', 'Presidential Suite Bedroom', 2),
((SELECT id FROM rooms WHERE type = 'suite'), '/src/assets/room-suite.jpg', 'Presidential Suite Living Area', 3),
((SELECT id FROM rooms WHERE type = 'suite'), '/src/assets/room-suite.jpg', 'Presidential Suite Jacuzzi', 4),
((SELECT id FROM rooms WHERE type = 'suite'), '/src/assets/room-suite.jpg', 'Presidential Suite Ocean View Balcony', 5),
((SELECT id FROM rooms WHERE type = 'suite'), '/src/assets/room-suite.jpg', 'Presidential Suite Butler Service Area', 6);