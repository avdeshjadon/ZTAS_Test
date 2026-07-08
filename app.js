const API_BASE = 'https://zero-trust-authentication-system.onrender.com';

// DOM Elements
const loginToggle = document.getElementById('login-toggle');
const signupToggle = document.getElementById('signup-toggle');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authWrapper = document.getElementById('auth-wrapper');
const dashboard = document.getElementById('dashboard');
const toast = document.getElementById('toast');
const userNameEl = document.getElementById('user-name');
const userEmailEl = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');

// State
let token = localStorage.getItem('accessToken');

// Initialize
function init() {
    if (token) {
        fetchCurrentUser();
    }
}

// Toggle Forms
loginToggle.addEventListener('click', () => {
    loginToggle.classList.add('active');
    signupToggle.classList.remove('active');
    loginForm.classList.add('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.remove('active');
    signupForm.classList.add('hidden');
});

signupToggle.addEventListener('click', () => {
    signupToggle.classList.add('active');
    loginToggle.classList.remove('active');
    signupForm.classList.add('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.remove('active');
    loginForm.classList.add('hidden');
});

// Show Toast
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('signup-fname').value;
    const lastName = document.getElementById('signup-lname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            showToast('Registration successful! Please login.');
            loginToggle.click();
            signupForm.reset();
        } else {
            // Spring validation errors might return an array of errors or a message
            let errMsg = data.message || 'Registration failed';
            if (data.errors && Array.isArray(data.errors)) {
                errMsg = data.errors[0];
            } else if (data.message && typeof data.message === 'object') {
                errMsg = Object.values(data.message)[0];
            }
            showToast(errMsg, 'error');
        }
    } catch (err) {
        showToast('Network error or CORS issue', 'error');
        console.error(err);
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (res.ok && data.accessToken) {
            token = data.accessToken;
            localStorage.setItem('accessToken', token);
            showToast('Login successful!');
            loginForm.reset();
            fetchCurrentUser();
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (err) {
        showToast('Network error or CORS issue', 'error');
        console.error(err);
    }
});

// Fetch Current User
async function fetchCurrentUser() {
    try {
        const res = await fetch(`${API_BASE}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (res.ok) {
            const user = await res.json();
            showDashboard(user);
        } else {
            // Token might be invalid/expired
            logout(false);
        }
    } catch (err) {
        showToast('Failed to fetch user data', 'error');
    }
}

// Show Dashboard
function showDashboard(user) {
    authWrapper.classList.add('hidden');
    dashboard.classList.remove('hidden');
    userNameEl.textContent = `${user.firstName} ${user.lastName}`;
    userEmailEl.textContent = user.email;
}

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        if(token) {
             await fetch(`${API_BASE}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
    } catch (err) {
        console.error(err);
    }
    logout(true);
});

function logout(showToastMsg = true) {
    token = null;
    localStorage.removeItem('accessToken');
    dashboard.classList.add('hidden');
    authWrapper.classList.remove('hidden');
    if(showToastMsg) {
        showToast('Logged out successfully');
    }
}

// Start
init();
