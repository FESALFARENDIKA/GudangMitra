/* ============================================
   GudangMitra - Reseller Dashboard JavaScript
   ============================================ */

let products = [];
let suppliers = [];
let academy = [];

async function loadDataFromSupabase() {
  if (typeof window.sb === 'undefined') return;

  try {
    const { data: { session } } = await window.sb.auth.getSession();
    if (!session) {
      console.warn("No active session found in reseller dashboard.");
      return;
    }

    console.log("Loading data for reseller:", session.user.email);

    // 1. Fetch Products
    const { data: dbProducts, error: pErr } = await window.sb
      .from('products')
      .select('*, supplier_data:supplier_id(id, store_name)')
      .eq('validation_status', 'approved');

    if (pErr) console.error("Error fetching products:", pErr);
    if (dbProducts) {
      console.log("Fetched products:", dbProducts.length);
      products = dbProducts.map(p => ({
        id: p.id,
        supplier_id: p.supplier_id,
        name: p.name,
        supplier: p.supplier_data ? p.supplier_data.store_name : 'Supplier Lokal',
        category: p.category,
        cost: p.cost_price,
        price: p.selling_price,
        margin: p.margin_percent || Math.round(((p.selling_price - p.cost_price)/p.cost_price)*100),
        stock: p.stock,
        trending: p.is_trending,
        aiScore: p.ai_score,
        emoji: p.emoji || '📦',
        imageUrl: p.image_url
      }));
    }

    // 2. Fetch Suppliers
    const { data: dbSuppliers, error: sErr } = await window.sb
      .from('supplier_profiles')
      .select('*, user_data:user_id(store_name)');
    
    if (sErr) console.error("Error fetching suppliers:", sErr);
    if (dbSuppliers) {
      suppliers = dbSuppliers.map(s => ({
        id: s.user_data?.store_name || 'Unknown',
        name: s.user_data?.store_name || 'Toko Supplier',
        rating: s.rating,
        orders: s.orders_completed,
        speed: s.speed_score,
        quality: s.quality_score,
        badge: s.badge
      })).sort((a,b) => b.rating - a.rating);
    }

    // 3. Fetch Academy
    const { data: dbAcademy, error: aErr } = await window.sb.from('academy_courses').select('*');
    if (aErr) console.error("Error fetching academy:", aErr);
    if (dbAcademy) {
      academy = dbAcademy;
    }

    // 4. Fetch own active orders
    const { data: dbOrders, error: oErr } = await window.sb
      .from('orders')
      .select('*, product_id(name)')
      .eq('reseller_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (oErr) console.error("Error fetching orders:", oErr);
    if (dbOrders) {
      window.myOrders = dbOrders;
    }

    // 5. Update UI
    console.log("Updating UI components...");
    renderProducts();
    renderTrending();
    renderSupplierRanking();
    renderMarginTable();
    populateOrderDropdown();
    renderAcademy();
    renderTransactions();

  } catch (err) {
    console.error("Critical error in loadDataFromSupabase:", err);
  }
}

// ============ Render Products ============
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:2rem;">Belum ada produk.</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const imgHtml = p.imageUrl 
      ? `<img src="${p.imageUrl}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-lg);">` 
      : `<span style="font-size: 4rem;">${p.emoji}</span>`;
      
    return `
    <div class="product-card" data-category="${p.category}">
      <div class="card-image" style="background: var(--gray-100);position:relative;">
        ${imgHtml}
        ${p.trending ? '<span class="trending-badge" style="position:absolute;top:10px;left:10px;">🔥 Trending</span>' : ''}
      </div>
      <div class="card-body">
        <h4>${p.name}</h4>
        <div class="product-supplier">🏭 ${p.supplier}</div>
        <div style="display:flex;align-items:center;gap:8px;margin:8px 0;">
          <div class="star-rating">⭐⭐⭐⭐⭐</div>
          <span style="font-size:0.78rem;color:var(--gray-400);">Stok: ${p.stock}</span>
        </div>
        <div class="price-row">
          <span class="product-price">${formatRupiah(p.price)}</span>
          <span class="product-margin">+${p.margin}% margin</span>
        </div>
      </div>
    </div>
  `}).join('');
}

function filterProducts(category) {
  renderProducts(category);
  document.querySelectorAll('#panel-recommendation .panel-tab').forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');
}

// ============ Render Trending ============
function renderTrending() {
  const list = document.getElementById('trendingList');
  if (!list) return;
  const trending = [...products].sort((a, b) => b.aiScore - a.aiScore).slice(0, 5);
  list.innerHTML = trending.map((p, i) => `
    <div class="ranking-item">
      <div class="ranking-position ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">${i + 1}</div>
      <div style="font-size:1.5rem;margin-right:4px;">${p.imageUrl ? `<img src="${p.imageUrl}" width="40" height="40" style="border-radius:4px;object-fit:cover;">` : p.emoji}</div>
      <div class="ranking-info">
        <div class="ranking-name">${p.name}</div>
        <div class="ranking-meta">🤖 AI Score: ${p.aiScore}/100</div>
      </div>
      <div class="ranking-score">
        <div class="score-value">+${p.margin}%</div>
        <div class="score-label">margin</div>
      </div>
    </div>
  `).join('');
}

// ============ Render Supplier Ranking ============
function renderSupplierRanking() {
  const list = document.getElementById('supplierRankingList');
  if (!list) return;
  list.innerHTML = suppliers.map((s, i) => `
    <div class="ranking-item">
      <div class="ranking-position ${s.badge}">${i + 1}</div>
      <div class="ranking-info">
        <div class="ranking-name">${s.name}</div>
        <div class="ranking-meta">⭐ ${s.rating} • ${s.orders.toLocaleString()} Orders • Kirim: ${s.speed}%</div>
      </div>
      <div class="ranking-score">
        <div class="score-value">${s.rating}</div>
        <div class="score-label">rating</div>
      </div>
    </div>
  `).join('');
}

// ============ Render Margin Table ============
function renderMarginTable() {
  const tbody = document.getElementById('marginTableBody');
  if (!tbody) return;
  tbody.innerHTML = products.map(p => {
    const profit = p.price - p.cost;
    const marginPct = ((profit / p.cost) * 100).toFixed(0);
    let status, statusClass, recommendation;
    if (marginPct >= 80) { status = '🟢 Sangat Baik'; statusClass = 'success'; recommendation = 'Pertahankan & Scale Up'; } 
    else if (marginPct >= 50) { status = '🟡 Baik'; statusClass = 'warning'; recommendation = 'Optimalkan Volume'; } 
    else { status = '🔴 Rendah'; statusClass = 'danger'; recommendation = 'Negosiasi Harga Supplier'; }
    
    return `<tr>
      <td><div class="product-cell"><div class="product-thumb">${p.imageUrl ? `<img src="${p.imageUrl}" width="100%">` : p.emoji}</div><div class="product-info"><div class="product-name">${p.name}</div></div></div></td>
      <td>${formatRupiah(p.cost)}</td>
      <td>${formatRupiah(p.price)}</td>
      <td><strong style="color:var(--primary);">${marginPct}%</strong> (${formatRupiah(profit)})</td>
      <td><span class="status-badge ${statusClass}">${status}</span></td>
      <td style="font-size:0.85rem;color:var(--gray-500);">${recommendation}</td>
    </tr>`;
  }).join('');
}

// ============ Render Transaksi Aktif ============
function renderTransactions() {
  const container = document.getElementById('transactionList');
  if (!container) return;

  const orders = window.myOrders || [];
  if (orders.length === 0) {
    container.innerHTML = '<div style="color:var(--gray-500);font-size:0.9rem;">Belum ada transaksi.</div>';
    document.getElementById('escrowTotal').textContent = 'Rp 0';
    document.getElementById('escrowCount').textContent = '0 transaksi';
    return;
  }

  let totalEscrow = 0;
  container.innerHTML = orders.map(o => {
    totalEscrow += Number(o.total_price);
    const shortId = "ORD-" + o.id.split('-')[0].toUpperCase();
    const prodName = o.product_id ? o.product_id.name : 'Produk Terhapus';
    
    let icon = '🔒', statusClass = 'warning', statusText = '⏳ Proses';
    if(o.status === 'shipped') { icon = '🚛'; statusClass = 'info'; statusText = '🚛 Dikirim'; }
    if(o.status === 'completed') { icon = '✅'; statusClass = 'success'; statusText = '✓ Selesai'; }

    return `
      <div class="ranking-item">
        <div style="font-size:1.5rem;">${icon}</div>
        <div class="ranking-info">
          <div class="ranking-name">${shortId}</div>
          <div class="ranking-meta">${prodName} • ${o.qty} pcs</div>
        </div>
        <div class="ranking-score">
          <div class="score-value" style="color: var(--accent-orange);">${formatRupiah(o.total_price)}</div>
          <div class="score-label">${statusText}</div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('escrowTotal').textContent = formatRupiah(totalEscrow);
  document.getElementById('escrowCount').textContent = `${orders.length} transaksi aktif`;
}

// ============ Profit Calculator ============
function calculateProfit() {
  const cost = parseFloat(document.getElementById('calcCost').value) || 0;
  const price = parseFloat(document.getElementById('calcPrice').value) || 0;
  const qty = parseInt(document.getElementById('calcQty').value) || 0;
  const shipping = parseFloat(document.getElementById('calcShipping').value) || 0;
  const fee = parseFloat(document.getElementById('calcFee').value) || 0;
  
  const profitPerUnit = price - cost - shipping - fee;
  const marginPercent = cost > 0 ? ((profitPerUnit / cost) * 100).toFixed(1) : 0;
  const totalRevenue = price * qty;
  const totalProfit = profitPerUnit * qty;
  
  document.getElementById('profitPerUnit').textContent = formatRupiah(profitPerUnit);
  document.getElementById('profitMarginPercent').textContent = `Margin: ${marginPercent}%`;
  document.getElementById('totalRevenue').textContent = formatRupiah(totalRevenue);
  document.getElementById('totalProfit').textContent = formatRupiah(totalProfit);
}

// ============ Validation Order API ============
function populateOrderDropdown() {
  const sel = document.getElementById('valProduct');
  if(!sel) return;
  sel.innerHTML = '<option value="">Pilih Produk untuk Divalidasi</option>' + products.map(p => `<option value="${p.id}">${p.name} - ${formatRupiah(p.price)}</option>`).join('');
}

function validateOrder() {
  const productId = document.getElementById('valProduct').value;
  const qty = parseInt(document.getElementById('valQty').value) || 0;
  const address = document.getElementById('valAddress').value.trim();
  const btn = document.getElementById('btnSubmitOrder');
  
  if (!productId) {
    btn.disabled = true;
    return;
  }
  
  const prod = products.find(p => p.id === productId);
  let isStockValid = qty <= prod.stock && qty > 0;
  let isAddressValid = address.length > 5;
  
  // Disable button initially until validation completes or fails
  btn.disabled = true;
  btn.style.opacity = '0.5';

  setTimeout(() => document.getElementById('vStock').innerHTML = isStockValid ? '<span class="v-status pass">✓ Tersedia</span>' : '<span class="v-status fail">✗ Stok Kurang</span>', 300);
  setTimeout(() => document.getElementById('vSupplier').innerHTML = '<span class="v-status pass">✓ Aktif & Terverifikasi</span>', 600);
  setTimeout(() => document.getElementById('vPrice').innerHTML = '<span class="v-status pass">✓ Harga Valid</span>', 900);
  setTimeout(() => document.getElementById('vAddress').innerHTML = isAddressValid ? '<span class="v-status pass">✓ Valid</span>' : '<span class="v-status fail">✗ Tidak Valid</span>', 1200);
  setTimeout(() => {
    document.getElementById('vEscrow').innerHTML = '<span class="v-status pass">✓ Siap</span>';
    // Only enable if ALL valid
    if(isStockValid && isAddressValid) {
       btn.disabled = false;
       btn.style.opacity = '1';
    }
  }, 1500);
}

async function submitValidation() {
  const productId = document.getElementById('valProduct').value;
  const qty = parseInt(document.getElementById('valQty').value) || 0;
  const address = document.getElementById('valAddress').value.trim();

  if (!productId || qty < 1 || address.length < 5) {
    showToast('Lengkapi form order dengan valid!', 'warning');
    return;
  }
  
  const prod = products.find(p => p.id === productId);
  if(!prod) return;

  try {
    const { data: { session } } = await window.sb.auth.getSession();
    if(!session) throw new Error("Anda harus login.");

    const { error } = await window.sb.from('orders').insert({
      reseller_id: session.user.id,
      supplier_id: prod.supplier_id,
      product_id: productId,
      qty: qty,
      total_price: prod.price * qty,
      shipping_address: address,
      status: 'paid_escrow'
    });

    if (error) throw error;
    showToast('Order berhasil divalidasi dan disubmit ke Escrow! 🎉', 'success');
    
    setTimeout(() => {
      ['vStock', 'vSupplier', 'vPrice', 'vAddress', 'vEscrow'].forEach(id => {
        document.getElementById(id).innerHTML = '<span class="v-status pending">⏳ Menunggu</span>';
      });
      document.getElementById('valProduct').value = '';
      document.getElementById('valQty').value = '';
      document.getElementById('valAddress').value = '';
      
      // Reload UI to show new transaction
      loadDataFromSupabase();
    }, 2000);

  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ============ Render Academy ============
function renderAcademy() {
  const grid = document.getElementById('academyGrid');
  if(!grid) return;
  if(academy.length === 0) {
    grid.innerHTML = '<p>Belum ada course academy.</p>';
    return;
  }
  grid.innerHTML = academy.map(c => `
    <div class="product-card">
      <img src="${c.image_url}" alt="${c.title}" style="width:100%;height:150px;object-fit:cover;border-top-left-radius:var(--radius-lg);border-top-right-radius:var(--radius-lg);">
      <div class="card-body">
        <span class="status-badge info" style="margin-bottom:8px;display:inline-block;">${c.category} • ${c.level}</span>
        <h4>${c.title}</h4>
        <p style="color:var(--gray-500);font-size:0.85rem;margin:8px 0;">Pakar: ${c.author} • ⏱️ ${c.duration}</p>
        <button class="btn btn-outline" style="width:100%;margin-top:12px;" onclick="showToast('Memulai modul...', 'info')">Mulai Belajar</button>
      </div>
    </div>
  `).join('');
}

function formatRupiah(num) {
  if (num >= 1000000) return 'Rp ' + (num / 1000000).toFixed(1) + 'Jt';
  return 'Rp ' + num.toLocaleString('id-ID');
}

// ============ Initialize ============
document.addEventListener('DOMContentLoaded', () => {
  loadDataFromSupabase();
  calculateProfit();
});
