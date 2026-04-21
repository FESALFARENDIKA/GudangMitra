/* ============================================
   GudangMitra - Admin Dashboard JavaScript
   ============================================ */

let users = [];
let pendingProducts = [];

function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

async function loadAdminData() {
  if (typeof window.sb === 'undefined') return;

  try {
    // 1. Fetch Users
    const { data: dbUsers } = await window.sb
      .from('users')
      .select('*')
      .order('join_date', { ascending: false });
    
    if (dbUsers) users = dbUsers;

    // 2. Fetch Pending Products
    const { data: dbProducts } = await window.sb
      .from('products')
      .select('*, supplier_id(store_name, email)')
      .eq('validation_status', 'pending');

    if (dbProducts) pendingProducts = dbProducts;

    renderUsers();
    renderPendingProducts();
    updateStats();

  } catch(err) {
    console.error(err);
  }
}

function renderUsers() {
  const tbody = document.querySelector('#panel-users .data-table tbody');
  if(!tbody) return;

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Belum ada user.</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => {
    let roleClass = 'primary';
    let statusClass = 'success';
    let statusText = 'Active';

    if(u.role === 'supplier') roleClass = 'success';
    if(u.role === 'admin') roleClass = 'warning';

    const joinDate = new Date(u.join_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    const initial = (u.store_name || u.full_name || 'U').substring(0, 2).toUpperCase();

    return `
      <tr>
        <td>
          <div class="product-cell">
            <div class="product-thumb" style="background:var(--primary-bg);color:var(--primary);font-size:0.8rem;font-weight:700;">${initial}</div>
            <div class="product-info">
              <div class="product-name">${u.store_name || u.full_name || '-'}</div>
              <div class="product-sku">${u.email}</div>
            </div>
          </div>
        </td>
        <td><span class="status-badge ${roleClass}">${u.role}</span></td>
        <td>${u.store_name || '-'}</td>
        <td>${joinDate}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td><button class="btn btn-sm btn-outline">Detail</button></td>
      </tr>
    `;
  }).join('');
}

function renderPendingProducts() {
  const tbody = document.querySelector('#panel-validation .data-table tbody');
  if(!tbody) return;

  if (pendingProducts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Tidak ada produk yang perlu divaidasi.</td></tr>';
    return;
  }

  tbody.innerHTML = pendingProducts.map(p => {
    const supplierName = p.supplier_id ? p.supplier_id.store_name : 'Unknown';
    const thumb = p.image_url ? `<img src="${p.image_url}" width="40" height="40" style="object-fit:cover;border-radius:4px;">` : p.emoji;
    const submittedDate = new Date(p.created_at).toLocaleDateString('id-ID'); // simplified

    return `
      <tr>
        <td>
          <div class="product-cell">
            <div class="product-thumb">${thumb}</div>
            <div class="product-info">
              <div class="product-name">${p.name}</div>
              <a href="${p.image_url || '#'}" target="_blank" style="font-size:0.7rem;color:var(--primary);">[Lihat Foto]</a>
            </div>
          </div>
        </td>
        <td>${supplierName}</td>
        <td>${p.category}</td>
        <td>${formatRupiah(p.selling_price)}</td>
        <td>${submittedDate}</td>
        <td style="white-space:nowrap;">
          <button class="btn btn-sm btn-primary" onclick="approveProduct('${p.id}')" style="margin-right:4px;">✓ Approve</button>
          <button class="btn btn-sm btn-outline" onclick="rejectProduct('${p.id}')" style="border-color:var(--accent-red);color:var(--accent-red);">✗ Tolak</button>
        </td>
      </tr>
    `;
  }).join('');
}

function updateStats() {
  const totUser = users.length;
  const totSupplier = users.filter(u=>u.role==='supplier').length;
  const totReseller = users.filter(u=>u.role==='reseller').length;
  
  const stats = document.querySelectorAll('#panel-overview .stat-value');
  if(stats.length >= 3) {
    stats[0].textContent = totUser;
    stats[1].textContent = totSupplier;
    stats[2].textContent = totReseller;
  }
}

// ============ Actions ============
async function approveProduct(id) {
  try {
    const { error } = await window.sb.from('products').update({ validation_status: 'approved' }).eq('id', id);
    if(error) throw error;
    showToast(`Produk berhasil di-approve! ✓`, 'success');
    loadAdminData();
  } catch(err) {
    showToast(err.message, 'error');
  }
}

async function rejectProduct(id) {
  if(!confirm("Anda yakin ingin menolak tawaran produk ini?")) return;
  try {
    const { error } = await window.sb.from('products').update({ validation_status: 'rejected' }).eq('id', id);
    if(error) throw error;
    showToast(`Produk ditolak.`, 'warning');
    loadAdminData();
  } catch(err) {
    showToast(err.message, 'error');
  }
}

// ============ Init ============
document.addEventListener('DOMContentLoaded', () => {
  loadAdminData();
});
