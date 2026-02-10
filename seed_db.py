import sqlite3

def seed_products():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    products = [
        ('Smart LED Bulb 9W', 'LED Lights', 'Wi-Fi enabled, multi-color, voice control compatible.', 'images/led_bulb.png'),
        ('Decorative Chandelier', 'Fancy Lights', 'Modern crystal design suitable for living rooms.', 'images/chandelier.png'),
        ('Modular Switch Board', 'Switches', 'High-quality fire-resistant modular switches.', 'images/switch_board.png'),
        ('Ceiling Fan 1200mm', 'Fans', 'High speed, energy efficient motor with 5 star rating.', 'images/ceiling_fan.png'),
        ('Flex Box Extension', 'Wires', '4-way extension board with surge protection.', 'images/extension_box.png'),
        ('Tube Light Batten', 'Tube Lights', '20W LED batten, cool daylight, flicker free.', 'images/tubelight.png')
    ]
    
    cursor.executemany('''
        INSERT INTO products (name, category, description, image_url)
        VALUES (?, ?, ?, ?)
    ''', products)
    
    conn.commit()
    conn.close()
    print("Database seeded with initial products.")

if __name__ == '__main__':
    seed_products()
