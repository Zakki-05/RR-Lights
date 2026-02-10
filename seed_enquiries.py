import sqlite3
import datetime

def seed_enquiries():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    enquiries = [
        ('Senthil Kumar', 'senthil@example.com', '9876543210', 'Do you have 20W LED Battens in bulk stock?', datetime.datetime.now()),
        ('Priya Rajan', 'priya@test.com', '9988776655', 'I need a quotation for switches for a 2BHK flat.', datetime.datetime.now()),
        ('Mohammed Ali', '', '8877665544', 'Shop opening timings on Sunday?', datetime.datetime.now())
    ]
    
    cursor.executemany('''
        INSERT INTO enquiries (name, email, phone, message, created_at)
        VALUES (?, ?, ?, ?, ?)
    ''', enquiries)
    
    conn.commit()
    conn.close()
    print("Database seeded with initial enquiries.")

if __name__ == '__main__':
    seed_enquiries()
