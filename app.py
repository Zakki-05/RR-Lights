from flask import Flask, render_template, request, jsonify, redirect, url_for, session, Response, send_from_directory
import sqlite3
import os
from functools import wraps

from werkzeug.utils import secure_filename

app = Flask(__name__)
# In production, this should be a strong random secret
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_key_rr_lighthouse_2024')
app.config['DATABASE'] = 'database.db'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# ... (db connection and auth decorator remain same) ...

# ... (db connection and auth decorator remain same) ...
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'rrlights')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'rrlights@123')

def get_db_connection():
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return conn

# Authentication Decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# --- Standard Routes ---
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/products')
def products():
    return render_template('products.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

# --- API Endpoints ---

@app.route('/api/products', methods=['GET'])
def get_products():
    """Fetch all products or filter by category"""
    category = request.args.get('category')
    search = request.args.get('search')
    
    conn = get_db_connection()
    query = "SELECT * FROM products WHERE 1=1"
    params = []
    
    if category and category != 'All':
        query += " AND category = ?"
        params.append(category)
        
    if search:
        query += " AND (name LIKE ? OR description LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term])
        
    products_db = conn.execute(query, params).fetchall()
    conn.close()
    
    products_list = [dict(row) for row in products_db]
    return jsonify(products_list)

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    """Handle contact form submission"""
    data = request.json
    name = data.get('name')
    email = data.get('email', '')
    phone = data.get('phone', '')
    message = data.get('message')
    
    if not name or not message:
        return jsonify({'error': 'Name and Message are required'}), 400
        
    conn = get_db_connection()
    conn.execute('INSERT INTO enquiries (name, email, phone, message) VALUES (?, ?, ?, ?)',
                 (name, email, phone, message))
    conn.commit()
    conn.close()
    
    return jsonify({'success': 'Message sent successfully!'})

# --- Admin Panel ---

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session['logged_in'] = True
            return redirect(url_for('admin'))
        else:
            return render_template('login.html', error='Invalid credentials')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('home'))

@app.route('/admin', methods=['GET', 'POST'])
@login_required
def admin():
    conn = get_db_connection()
    
    if request.method == 'POST':
        # Handle Product Addition
        name = request.form['name']
        category = request.form['category']
        description = request.form['description']
        
        # Basic Image Handling (In production, use secure_filename and upload folder)
        image_url = 'default_product.jpg' 
        # Ideally we would handle file upload here, but for simplicity let's stick to a manual URL or placeholder
        # Or if the user wants real uploads:
        # file = request.files['image']
        # if file:
        #     filename = secure_filename(file.filename)
        #     file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        conn.execute('INSERT INTO products (name, category, description, image_url) VALUES (?, ?, ?, ?)',
                     (name, category, description, image_url))
        conn.commit()
        return redirect(url_for('admin'))
        
    enquiries = conn.execute('SELECT * FROM enquiries ORDER BY created_at DESC').fetchall()
    products = conn.execute('SELECT * FROM products ORDER BY created_at DESC').fetchall()
    conn.close()
    return render_template('admin.html', enquiries=enquiries, products=products)

@app.route('/admin/delete_enquiry/<int:id>', methods=['POST'])
@login_required
def delete_enquiry(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM enquiries WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('admin'))

# --- SEO Routes ---

@app.route('/robots.txt')
def robots():
    """Generate robots.txt dynamically"""
    host = request.host_url.rstrip('/')
    content = f"User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\n\nSitemap: {host}/sitemap.xml"
    return Response(content, mimetype='text/plain')

@app.route('/sitemap.xml')
def sitemap():
    """Generate sitemap dynamically"""
    host = request.host_url.rstrip('/')
    pages = ['home', 'about', 'products', 'services', 'contact']
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for page in pages:
        xml += f'  <url>\n    <loc>{host}/{page}</loc>\n    <priority>0.8</priority>\n  </url>\n'
    xml += '</urlset>'
    return Response(xml, mimetype='application/xml')

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True)
