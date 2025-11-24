// Cart Management - Handle shopping cart using localStorage

// Get cart from localStorage
function getCart() {
  const cartStr = localStorage.getItem('cart');
  return cartStr ? JSON.parse(cartStr) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Add item to cart
function addToCart(product) {
  const cart = getCart();
  
  // Check if product already exists in cart
  const existingItem = cart.find(item => item._id === product._id);
  
  if (existingItem) {
    // Increase quantity
    existingItem.quantity += 1;
  } else {
    // Add new item with quantity 1
    cart.push({
      _id: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  saveCart(cart);
  showNotification('Item added to cart!');
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item._id !== productId);
  saveCart(cart);
}

// Update item quantity
function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item._id === productId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

// Get total cart price
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get total items count in cart
function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Update cart count badge in header
function updateCartCount() {
  const count = getCartCount();
  const badge = document.querySelector('.cart-count');
  
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Clear entire cart
function clearCart() {
  localStorage.removeItem('cart');
  updateCartCount();
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background-color: #10B981;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    font-weight: 600;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);
