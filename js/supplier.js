/* ============================================
   GudangMitra - Supplier Dashboard JavaScript (Supabase DB)
   ============================================ */

let products = [];
let orders = [];

function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

async function loadSupplierData() {
  if (typeof window.sb === 'undefined') return;
  const { data: { session } } = await window.sb.auth.getSession();
  if(!session) return;
  
  const userId = session.user.id;

  try {
    // 1. Fetch own products
    const { data: dbProducts } = await window.sb
      .from('products')
      .select('*')
      .eq('supplier_id', userId);
    
    if (dbProducts) products = dbProducts;

    // 2. Fetch incoming orders
    const { data: dbOrders } = await window.sb
      .from('orders')
      .select('*, product_id(*), reseller_id(store_name, full_name)')
      .eq('supplier_id', userId);

    if (dbOrders) orders = dbOrders;

    renderProducts();
    renderOrders();
    updateStats();

  } catch(err) {
    console.error(err);
  }
}

function renderProducts() {
  const tbody = document.querySelector('#panel-products .data-table tbody');
  if(!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Belum ada produk.</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(p => {
    let statusClass = 'warning';
    let statusText = '⏳ Review';
    if(p.validation_status === 'approved') { statusClass = 'success'; statusText = '✓ Valid'; }
    if(p.validation_status === 'rejected') { statusClass = 'danger'; statusText = '✗ Ditolak'; }

    const thumb = p.image_url ? `<img src="${p.image_url}" width="40" height="40" style="object-fit:cover;border-radius:4px;">` : p.emoji;

    let actionBtn = '';
    if(p.validation_status === 'rejected') {
      actionBtn = `<button class="btn btn-sm btn-outline" onclick="revalidateProduct('${p.id}')">Ajukan Ulang</button>`;
    } else if (p.validation_status === 'pending') {
      actionBtn = `<button class="btn btn-sm btn-outline" disabled>Menunggu</button>`;
    } else {
      actionBtn = `<button class="btn btn-sm btn-outline" disabled style="background:var(--accent-green);color:white;border:none;">Aktif</button>`;
    }

    return `
      <tr>
        <td>
          <div class="product-cell">
            <div class="product-thumb">${thumb}</div>
            <div class="product-info">
              <div class="product-name">${p.name}</div>
            </div>
          </div>
        </td>
        <td>${p.category}</td>
        <td>${formatRupiah(p.selling_price)}</td>
        <td>${p.stock}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${actionBtn}</td>
      </tr>
    `;
  }).join('');
}

function renderOrders() {
  const tbody = document.querySelector('#panel-orders .data-table tbody');
  if(!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Belum ada order masuk.</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(o => {
    let statusClass = 'warning';
    let statusText = '⏳ Pending';
    if(o.status === 'paid_escrow') { statusClass = 'primary'; statusText = 'Escrow (Siap Proses)'; }
    if(o.status === 'shipped') { statusClass = 'info'; statusText = '🚛 Dikirim'; }
    if(o.status === 'completed') { statusClass = 'success'; statusText = '✓ Selesai'; }

    let actionBtn = '';
    if(o.status === 'paid_escrow') {
      actionBtn = `<button class="btn btn-sm btn-primary" onclick="processOrder('${o.id}')">Kirim Resi</button>`;
    } else {
      actionBtn = `<button class="btn btn-sm btn-outline" disabled>Riwayat</button>`;
    }

    const prodName = o.product_id ? o.product_id.name : 'Produk Dihapus';
    const resellerName = o.reseller_id ? (o.reseller_id.store_name || o.reseller_id.full_name) : 'User_Del';

    return `
      <tr>
        <td><strong>${o.id.split('-')[0].toUpperCase()}</strong></td>
        <td>${resellerName}</td>
        <td>${prodName}</td>
        <td>${o.qty}</td>
        <td>${formatRupiah(o.total_price)}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${actionBtn}</td>
      </tr>
    `;
  }).join('');
}

function updateStats() {
  // Mock updates for overview dashboard
  const activeCount = products.filter(p=>p.validation_status==='approved').length;
  document.querySelector('.stat-value').textContent = activeCount;
}

// ============ Actions ============
function addProduct() {
  const modal = document.getElementById('addProductModal');
  if (modal) modal.style.display = 'flex';
}

function closeAddModal() {
  const modal = document.getElementById('addProductModal');
  if (modal) modal.style.display = 'none';
  document.getElementById('addProductForm').reset();
}

async function submitProductForm(e) {
  e.preventDefault();
  
  const btn = document.getElementById('btnSaveProduct');
  btn.textContent = 'Menyimpan...';
  btn.disabled = true;

  const cost = parseInt(document.getElementById('addCost').value);
  const price = parseInt(document.getElementById('addPrice').value);
  
  const prod = {
    name: document.getElementById('addName').value,
    category: document.getElementById('addCategory').value,
    cost_price: cost,
    selling_price: price,
    margin_percent: Math.round(((price - cost) / cost) * 100),
    stock: parseInt(document.getElementById('addStock').value),
    image_url: document.getElementById('addImage').value || ''
  };

  await submitNewProduct(prod);

  btn.textContent = 'Simpan Produk';
  btn.disabled = false;
  closeAddModal();
}

async function submitNewProduct(prod) {
  const { data: { session } } = await window.sb.auth.getSession();
  if(!session) return;
  
  try {
    prod.supplier_id = session.user.id;
    prod.validation_status = 'pending';
    
    const { error } = await window.sb.from('products').insert([prod]);
    if(error) throw error;
    
    showToast('Produk berhasil ditambahkan. Menunggu review Admin.', 'success');
    loadSupplierData();
  } catch(err) {
    showToast('Gagal tambah produk: '+err.message, 'error');
  }
}

let currentProcessingOrderId = null;

function processOrder(orderId) {
  currentProcessingOrderId = orderId;
  const modal = document.getElementById('processOrderModal');
  if (modal) modal.style.display = 'flex';
}

function closeProcessModal() {
  currentProcessingOrderId = null;
  const modal = document.getElementById('processOrderModal');
  if (modal) modal.style.display = 'none';
}

async function confirmProcessOrder() {
  if(!currentProcessingOrderId) return;
  
  const btn = document.getElementById('btnConfirmProcess');
  btn.textContent = 'Memproses...';
  btn.disabled = true;

  try {
    const { error } = await window.sb.from('orders').update({ status: 'shipped' }).eq('id', currentProcessingOrderId);
    if(error) throw error;
    showToast(`Order berhasil dikirim!`, 'success');
    loadSupplierData();
  } catch(err) {
    showToast(err.message, 'error');
  } finally {
    btn.textContent = 'Ya, Kirim Sekarang';
    btn.disabled = false;
    closeProcessModal();
  }
}

async function revalidateProduct(prodId) {
  try {
    const { error } = await window.sb.from('products').update({ validation_status: 'pending' }).eq('id', prodId);
    if(error) throw error;
    showToast(`Produk diajukan ulang untuk validasi.`, 'info');
    loadSupplierData();
  } catch(err) {
    showToast(err.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSupplierData();
});
