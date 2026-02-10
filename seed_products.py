import sqlite3

def seed_products():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Check if products exist
    count = cursor.execute('SELECT count(*) FROM products').fetchone()[0]
    print(f"Current product count: {count}")
    
    if count == 0:
        print("Seeding products...")
        products = [
            ('Modern Chandelier', 'Fancy Lights', 'Elegant crystal chandelier for living rooms.', 'images/chandelier.png', 15000),
            ('LED Bulb 9W', 'LED Lights', 'Energy saving 9W LED bulb, cool white.', 'images/bulb.png', 120),
            ('Wall Sconce', 'Fancy Lights', 'Antique gold finish wall light.', 'images/wall_light.png', 2500),
            ('Ceiling Fan', 'Fans', 'High speed anti-dust ceiling fan.', 'images/fan.png', 3200),
            ('Modular Switch', 'Switches', 'Premium modular switch 6A.', 'images/switch.png', 45),
            ('Smart LED Strip', 'LED Lights', 'RGB WiFi controlled LED strip 5m.', 'images/strip.png', 850)
        ]
        
        # Check if price column exists (it was added recently)
        # Assuming schema is correct from previous steps.
        cursor.executemany('INSERT INTO products (name, category, description, image_url, price) VALUES (?, ?, ?, ?, ?)', products)
        conn.commit()
        print("Products seeded successfully.")
    else:
        print("Products already exist. Skipping seed.")
        
    conn.close()

if __name__ == '__main__':
    seed_products()
