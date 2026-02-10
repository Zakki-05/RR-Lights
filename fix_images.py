import sqlite3

def fix_images():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Map of old incorrect path -> new correct path
    updates = {
        'led_bulb.jpg': 'images/led_bulb.png',
        'chandelier.jpg': 'images/chandelier.png',
        'switch_board.jpg': 'images/switch_board.png',
        'ceiling_fan.jpg': 'images/ceiling_fan.png',
        'extension_box.jpg': 'images/extension_box.png',
        'tubelight.jpg': 'images/tubelight.png',
        # Ensure simple filenames also map to images/ directory if needed
        'led_bulb.png': 'images/led_bulb.png',
        'chandelier.png': 'images/chandelier.png'
    }
    
    print("Fixing image paths...")
    for old, new in updates.items():
        # Update rows where image_url is the old broken path
        cursor.execute("UPDATE products SET image_url = ? WHERE image_url = ?", (new, old))
        
    # Also check for any that are just 'filename.png' and need 'images/' prefix
    cursor.execute("UPDATE products SET image_url = 'images/' || image_url WHERE image_url NOT LIKE 'images/%' AND image_url NOT LIKE 'http%'")
    
    conn.commit()
    
    # Check results
    rows = cursor.execute("SELECT name, image_url FROM products").fetchall()
    for row in rows:
        print(row)
        
    conn.close()

if __name__ == '__main__':
    fix_images()
