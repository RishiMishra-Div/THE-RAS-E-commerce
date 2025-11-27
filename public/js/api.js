// API Helper Functions - Makes it easy to communicate with the backend

// Base URL for API (change this if your backend is on a different port)
const API_BASE_URL = '/api';

// Helper function to get current user from backend (MongoDB)
async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include' // ⬅ important so cookies are sent
    });

    if (!response.ok) {
      // Not logged in or some error
      return null;
    }

    const user = await response.json();
    return user; // this is user from MongoDB

  } catch (err) {
    console.error('Error fetching current user:', err);
    return null;
  }
}

// Helper function to check if user is logged in
async function isLoggedIn() {
  const user = await getCurrentUser();
  return user !== null;
}


// Helper function to check if user is admin
 async function isAdmin() {
  const user = await getCurrentUser();
  return user && user.role === 'admin';
}

// Helper function to logout
async function logout() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include' // send cookies for removal
    });

    window.location.href = '/'; // redirect to home page
  } catch (err) {
    console.error('Logout failed:', err);
  }
}


// AUTH API CALLS

// Sign up a new user
async function signup(fullname, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fullname, email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Signup failed');
  }
  
  // // Save token and user data
  // localStorage.setItem('token', data.token);
  // localStorage.setItem('user', JSON.stringify(data.user));
  
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
  
  // // Save token and user data
  // localStorage.setItem('token', data.token);
  // localStorage.setItem('user', JSON.stringify(data.user));
  
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
async function updateProduct(productId,updatedProduct) {
  // const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updatedProduct)
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
