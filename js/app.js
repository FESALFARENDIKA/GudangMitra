/* ============================================
   GudangMitra - Core App JavaScript
   ============================================ */

// ============ Navbar Scroll Effect ============
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// ============ Mobile Menu Toggle ============
function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.toggle('show');
  }
}

// ============ Scroll Reveal Animation ============
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  reveals.forEach(el => observer.observe(el));
}

// ============ Counter Animation ============
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target.toLocaleString('id-ID');
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current).toLocaleString('id-ID');
      }
    }, 16);
  });
}

// ============ Date Display ============
function updateDate() {
  const el = document.getElementById('dateDisplay');
  if (el) {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    el.textContent = now.toLocaleDateString('id-ID', options);
  }
}

// ============ Toast Notifications ============
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// ============ Dashboard Panel Switching ============
function showPanel(panelId) {
  // Hide all panels
  document.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));
  
  // Show target panel
  const panel = document.getElementById(`panel-${panelId}`);
  if (panel) {
    panel.classList.add('active');
  }
  
  // Update sidebar active state
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-panel') === panelId);
  });
  
  // Update title
  const titles = {
    'overview': 'Dashboard Overview',
    'recommendation': 'Smart Product Recommendation',
    'trending': 'AI Rekomendasi Produk Laris',
    'supplier-rank': 'Smart Supplier Ranking',
    'validation': 'Smart Validation Order',
    'margin': 'Analisis Margin Otomatis',
    'calculator': 'Auto Profit Calculator',
    'garansi': 'Sistem Garansi (Escrow)',
    'performa': 'Dashboard Performa Reseller',
    'academy': 'Mini Academy',
    'products': 'Validasi Produk',
    'ranking': 'Ranking Supplier',
    'orders': 'Order Masuk',
    'monitoring': 'Monitoring Validasi Produk',
    'users': 'User Management'
  };
  
  const titleEl = document.getElementById('panelTitle');
  if (titleEl && titles[panelId]) {
    titleEl.textContent = titles[panelId];
  }
  
  // Close mobile sidebar
  const sidebar = document.getElementById('sidebar');
  if (sidebar && window.innerWidth <= 768) {
    sidebar.classList.remove('open');
  }
}

// ============ Sidebar Toggle (Mobile) ============
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}

// ============ Logout ============
async function logout() {
  localStorage.removeItem('gudangmitra_demo_user');
  if (typeof window.sb !== 'undefined') {
    await window.sb.auth.signOut();
  }
  showToast('Berhasil logout!', 'success');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 500);
}

// ============ Auth Check ============
async function checkAuth() {
  const page = window.location.pathname.split('/').pop();
  const isDashboard = page.includes('dashboard');

  // Check Supabase if configured
  if (typeof window.sb !== 'undefined') {
    const { data: { session } } = await window.sb.auth.getSession();
    if (!session && isDashboard) {
      window.location.href = 'login.html';
    } else if (session) {
      const name = session.user.user_metadata.full_name || session.user.email;
      updateUserDisplay(name);
    }
  } else if (isDashboard) {
    // No supabase and no demo user
    window.location.href = 'login.html';
  }
}

function updateUserDisplay(name) {
  const nameEl = document.getElementById('userName');
  const avatarEl = document.getElementById('userAvatar'); // Wait, the HTML uses generic avatar but lets safeguard
  if (nameEl) nameEl.textContent = name;
  if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
}

// ============ Format Currency ============
function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

// ============ Search Handler ============
function handleSearch(event) {
  if (event.key === 'Enter') {
    const query = event.target.value.trim();
    if (query) {
      showToast(`Mencari "${query}"...`, 'info');
    }
  }
}

// ============ Notification ============
function showNotification() {
  showToast('Anda memiliki 3 notifikasi baru', 'info');
}

// ============ Smooth Scroll for Landing Page ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============ Initialize ============
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  updateDate();
  checkAuth();
  
  // Animate counters when stats section is visible
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  }
});
