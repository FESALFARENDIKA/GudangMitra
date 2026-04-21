/* ============================================
   GudangMitra - Supabase Authentication
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
  const container = el.parentElement;
  container.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
  el.classList.add('active');
}

// ============ Handle Login ============
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = e.target.querySelector('button[type="submit"]');

  // Fallback for Demo Accounts if Supabase fails or not configured
  const demoAccounts = {
    'reseller@demo.com': { password: 'demo123', role: 'reseller', full_name: 'Reseller Demo' },
    'supplier@demo.com': { password: 'demo123', role: 'supplier', full_name: 'Supplier Demo' },
    'admin@demo.com': { password: 'demo123', role: 'admin', full_name: 'Admin' }
  };

  if (demoAccounts[email] && demoAccounts[email].password === password) {
    // Demo Account Bypass
    const demoUser = demoAccounts[email];
    localStorage.setItem('gudangmitra_demo_user', JSON.stringify({
      email: email, role: demoUser.role, full_name: demoUser.full_name
    }));
    showToast(`Selamat datang via Demo, ${demoUser.full_name}!`, 'success');
    redirectByUserRole(demoUser.role);
    return;
  }

  // Real Supabase Login
  try {
    btn.textContent = 'Memproses...';
    btn.disabled = true;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;

    const user = data.user;
    const roleMatch = user.user_metadata.role || selectedRole;
    
    showToast(`Berhasil masuk!`, 'success');
    redirectByUserRole(roleMatch);

  } catch (err) {
    console.error('Login Error:', err);
    showToast(err.message || 'Email atau password salah!', 'error');
  } finally {
    btn.textContent = 'Masuk Sekarang';
    btn.disabled = false;
  }
}

// ============ Handle Register ============
async function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const store = document.getElementById('regStore').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  const btn = e.target.querySelector('button[type="submit"]');
  
  if (password !== confirm) {
    showToast('Password tidak cocok!', 'error');
    return;
  }
  
  if (password.length < 6) {
    showToast('Password minimal 6 karakter!', 'error');
    return;
  }
  
  try {
    btn.textContent = 'Mendaftar...';
    btn.disabled = true;

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name,
          phone: phone,
          store_name: store,
          role: selectedRole
        }
      }
    });

    if (error) throw error;

    showToast('Registrasi sukses! Silakan login.', 'success');
    
    // Switch to login tab
    setTimeout(() => {
      switchTab('login');
      document.getElementById('loginEmail').value = email;
      document.getElementById('loginPassword').value = '';
    }, 1500);

  } catch (err) {
    console.error('Register Error:', err);
    showToast(err.message || 'Gagal registrasi!', 'error');
  } finally {
    btn.textContent = 'Daftar Sekarang';
    btn.disabled = false;
  }
}

function redirectByUserRole(role) {
  setTimeout(() => {
    switch (role) {
      case 'supplier':
        window.location.href = 'dashboard-supplier.html';
        break;
      case 'admin':
        window.location.href = 'dashboard-admin.html';
        break;
      default:
        window.location.href = 'dashboard-reseller.html';
    }
  }, 1000);
}

// ============ Toast ============
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-message">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ============ Check logged in ============
document.addEventListener('DOMContentLoaded', async () => {
  // Check Demo First
  const demoUser = JSON.parse(localStorage.getItem('gudangmitra_demo_user') || 'null');
  if (demoUser) {
    redirectByUserRole(demoUser.role);
    return;
  }

  // Check Supabase
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const role = session.user.user_metadata.role || 'reseller';
    redirectByUserRole(role);
  }
});
