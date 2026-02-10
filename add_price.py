import sqlite3

def clean_orphaned_cart_items():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    # Remove cart items that reference non-existent products
    c.execute('DELETE FROM cart_items WHERE product_id NOT IN (SELECT id FROM products)')
    deleted = c.rowcount
    conn.commit()
    conn.close()
    print(f"Removed {deleted} orphaned cart items.")

def add_price_column():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    
    try:
        c.execute('ALTER TABLE products ADD COLUMN price REAL DEFAULT 0.0')
        print("Price column added successfully.")
    except sqlite3.OperationalError:
        print("Price column already exists.")
        
    # Update existing products with a mock price if 0
    c.execute('UPDATE products SET price = 999.00 WHERE price = 0.0')
    conn.commit()
    conn.close()

if __name__ == '__main__':
    clean_orphaned_cart_items()
    add_price_column()
