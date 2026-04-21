/* ============================================
   GudangMitra - Authentication JavaScript
   ============================================ */

let selectedRole = 'reseller';

// ============ Tab Switching ============
function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  
  if (tab === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    tabLogin.style.background = 'var(--primary-gradient)';
    tabLogin.style.color = 'white';
    tabRegister.style.background = 'transparent';
    tabRegister.style.color = 'var(--gray-500)';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    tabRegister.style.background = 'var(--primary-gradient)';
    tabRegister.style.color = 'white';
    tabLogin.style.background = 'transparent';
    tabLogin.style.color = 'var(--gray-500)';
  }
}

// ============ Role Selection ============
function selectRole(role, el) {
  selectedRole = role;
  // Remove active from all role buttons in same container
  const container = el.parentElement;
  container.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
  el.classList.add('active');
}

// ============ Handle Login ============
function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  // Demo accounts
  const demoAccounts = {
    'reseller@demo.com': { password: 'demo123', role: 'reseller', name: 'Reseller Demo' },
    'supplier@demo.com': { password: 'demo123', role: 'supplier', name: 'Supplier Demo' },
    'admin@demo.com': { password: 'demo123', role: 'admin', name: 'Admin' }
  };
  
  // Check registered users from localStorage
  const users = JSON.parse(localStorage.getItem('gudangmitra_users') || '[]');
  const registeredUser = users.find(u => u.email === email && u.password === password);
  
  let user = null;
  
  if (demoAccounts[email] && demoAccounts[email].password === password) {
    user = {
      email: email,
      role: demoAccounts[email].role,
      name: demoAccounts[email].name,
      store: demoAccounts[email].name + ' Store'
    };
  } else if (registeredUser) {
    user = registeredUser;
  } else {
    // For demo: allow any login with selected role
    if (email && password.length >= 3) {
      user = {
        email: email,
        role: selectedRole,
        name: email.split('@')[0],
        store: email.split('@')[0] + ' Store'
      };
    }
  }
  
  if (user) {
    localStorage.setItem('gudangmitra_user', JSON.stringify(user));
    showToast(`Selamat datang, ${user.name}!`, 'success');
    
    setTimeout(() => {
      switch (user.role) {
        case 'supplier':
          window.location.href = 'dashboard-supplier.html';
          break;
        case 'admin':
          window.location.href = 'dashboard-admin.html';
          break;
        default:
          window.location.href = 'dashboard-reseller.html';
      }
    }, 800);
  } else {
    showToast('Email atau password salah!', 'error');
  }
}

// ============ Handle Register ============
function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const store = document.getElementById('regStore').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  
  if (password !== confirm) {
    showToast('Password tidak cocok!', 'error');
    return;
  }
  
  if (password.length < 6) {
    showToast('Password minimal 6 karakter!', 'error');
    return;
  }
  
  // Save to localStorage
  const users = JSON.parse(localStorage.getItem('gudangmitra_users') || '[]');
  
  if (users.find(u => u.email === email)) {
    showToast('Email sudah terdaftar!', 'error');
    return;
  }
  
  const newUser = {
    name, phone, email, store, password,
    role: selectedRole,
    joinDate: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('gudangmitra_users', JSON.stringify(users));
  
  showToast('Registrasi berhasil! Silakan login.', 'success');
  
  // Switch to login tab
  setTimeout(() => {
    switchTab('login');
    document.getElementById('loginEmail').value = email;
  }, 1000);
}

// ============ Toast for Auth Page ============
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ============ Check if already logged in ============
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('gudangmitra_user') || 'null');
  if (user) {
    switch (user.role) {
      case 'supplier':
        window.location.href = 'dashboard-supplier.html';
        break;
      case 'admin':
        window.location.href = 'dashboard-admin.html';
        break;
      default:
        window.location.href = 'dashboard-reseller.html';
    }
  }
});
