-- Categories table (for menu)
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_per_night DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  capacity INTEGER DEFAULT 2,
  amenities TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  is_included BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name, description, image_url, sort_order) VALUES
('Breakfast', 'Start your day with our delicious breakfast options', '/images/eggs-benedict.jpg', 1),
('Lunch', 'Fresh salads and satisfying midday meals', '/images/caesar-salad.jpg', 2),
('Dinner', 'Exquisite dining experience', '/images/steak.jpg', 3),
('Beverages', 'Refreshing drinks and signature cocktails', '/images/cocktail.jpg', 4)
ON CONFLICT DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (category_id, name, description, price, image_url, tags, sort_order) VALUES
(1, 'Classic Eggs Benedict', 'Poached eggs on English muffin with hollandaise sauce', 16.00, '/images/eggs-benedict.jpg', ARRAY['Popular', 'Chef''s Choice'], 1),
(1, 'Avocado Toast', 'Smashed avocado on artisan sourdough with cherry tomatoes', 14.00, '/images/avocado-toast.jpg', ARRAY['Vegetarian', 'Healthy'], 2),
(2, 'Grilled Caesar Salad', 'Crisp romaine with parmesan, croutons and caesar dressing', 15.00, '/images/caesar-salad.jpg', ARRAY['Healthy'], 1),
(2, 'Gourmet Burger', 'Angus beef with aged cheddar and caramelized onions', 22.00, '/images/burger.jpg', ARRAY['Popular'], 2),
(3, 'Pan-Seared Salmon', 'Fresh salmon with seasonal vegetables and lemon butter', 32.00, '/images/salmon.jpg', ARRAY['Healthy', 'Gluten-Free'], 1),
(3, 'Filet Mignon', 'Prime beef tenderloin with red wine reduction', 48.00, '/images/steak.jpg', ARRAY['Premium', 'Chef''s Choice'], 2),
(4, 'Signature Cocktail', 'House specialty with premium spirits', 14.00, '/images/cocktail.jpg', ARRAY['Popular'], 1),
(4, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 8.00, '/images/juice.jpg', ARRAY['Healthy', 'Fresh'], 2)
ON CONFLICT DO NOTHING;

-- Insert sample rooms
INSERT INTO rooms (name, description, price_per_night, image_url, capacity, amenities, sort_order) VALUES
('Standard Room', 'Comfortable room with essential amenities for a relaxing stay', 120.00, '/images/standard-room.jpg', 2, ARRAY['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Fridge'], 1),
('Deluxe Room', 'Spacious room with city views and premium amenities', 180.00, '/images/deluxe-room.jpg', 2, ARRAY['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'City View', 'Room Service'], 2),
('Executive Suite', 'Luxurious suite with separate living area and workspace', 280.00, '/images/executive-suite.jpg', 3, ARRAY['Free WiFi', 'Air Conditioning', 'Smart TV', 'Full Mini Bar', 'City View', '24/7 Room Service', 'Work Desk', 'Lounge Access'], 3),
('Presidential Suite', 'Ultimate luxury with panoramic views and exclusive services', 450.00, '/images/presidential-suite.jpg', 4, ARRAY['Free WiFi', 'Air Conditioning', 'Smart TV', 'Full Mini Bar', 'Panoramic View', '24/7 Butler Service', 'Private Dining', 'Jacuzzi', 'VIP Lounge Access'], 4)
ON CONFLICT DO NOTHING;

-- Insert sample services
INSERT INTO services (name, description, price, is_included, sort_order) VALUES
('Airport Shuttle', 'Complimentary pickup and drop-off service', NULL, true, 1),
('Breakfast Buffet', 'Full breakfast buffet included with stay', NULL, true, 2),
('Spa Access', 'Relaxing spa and wellness center access', 50.00, false, 3),
('Laundry Service', 'Same-day laundry and dry cleaning', 25.00, false, 4),
('Late Checkout', 'Extend your stay until 2 PM', 30.00, false, 5)
ON CONFLICT DO NOTHING;
