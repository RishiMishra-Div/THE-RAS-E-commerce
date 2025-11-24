// API Helper Functions - Makes it easy to communicate with the backend

// Base URL for API (change this if your backend is on a different port)
const API_BASE_URL = '/api';

// Helper function to get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('token');
}

// Helper function to get user data from localStorage
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Helper function to check if user is logged in
function isLoggedIn() {
  return !!getAuthToken();
}

// Helper function to check if user is admin
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

// Helper function to logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

// AUTH API CALLS

// Sign up a new user
async function signup(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Signup failed');
  }
  
  // Save token and user data
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}

// Login user
async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  
  // Save token and user data
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}

// PRODUCT API CALLS

// Get all products (optional: filter by category)
async function getProducts(category = null) {
  let url = `${API_BASE_URL}/products`;
  
  if (category) {
    url += `?category=${encodeURIComponent(category)}`;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch products');
  }
  
  return data;
}

// Get single product by ID
async function getProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch product');
  }
  
  return data;
}

// Create new product (admin only)
async function createProduct(productData) {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create product');
  }
  
  return data;
}

// Update product (admin only)
async function updateProduct(id, productData) {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update product');
  }
  
  return data;
}

// Delete product (admin only)
async function deleteProduct(id) {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete product');
  }
  
  return data;
}

// Get all categories
async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/products/categories/list`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch categories');
  }
  
  return data;
}
