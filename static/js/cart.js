document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Expose for dynamic content
    window.refreshCartState = updateCartCount;
});

async function updateCartCount() {
    try {
        const response = await fetch('/api/cart');
        const items = await response.json();
        const count = items.reduce((sum, item) => sum + item.quantity, 0);

        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'inline-flex' : 'none';
        });

        // Dispatch event for other components (like product cards)
        const event = new CustomEvent('cartUpdated', { detail: items });
        document.dispatchEvent(event);

        return items;
    } catch (error) {
        console.error('Error fetching cart:', error);
        return [];
    }
}

// Global Add to Cart function for reusability
window.addToCart = async (productId) => {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId })
        });
        const result = await response.json();
        if (result.success) {
            updateCartCount();
            if (window.showToast) {
                window.showToast('Item added to cart!', 'success');
            }
            return true;
        } else {
            if (window.showToast) {
                window.showToast('Failed to add item.', 'error');
            } else {
                alert('Failed to add item.');
            }
            return false;
        }
    } catch (error) {
        console.error(error);
        if (window.showToast) {
            window.showToast('Error adding item to cart.', 'error');
        } else {
            alert('Error adding item to cart.');
        }
        return false;
    }
};

window.removeFromCart = async (id) => {
    // ... logic if needed globally
};
