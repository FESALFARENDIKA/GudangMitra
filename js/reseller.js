/* ============================================
   GudangMitra - Reseller Dashboard JavaScript
   ============================================ */

// ============ Product Data ============
const products = [
  { id: 1, name: 'Skincare Set Premium', supplier: 'Agung Jaya', category: 'beauty', cost: 65000, price: 120000, margin: 84, stock: 250, trending: true, aiScore: 95, emoji: '🧴' },
  { id: 2, name: 'Kaos Polos Cotton 30s', supplier: 'Textile Indo', category: 'fashion', cost: 35000, price: 65000, margin: 85, stock: 500, trending: true, aiScore: 89, emoji: '👕' },
  { id: 3, name: 'Hijab Instan Premium', supplier: 'Agung Jaya', category: 'fashion', cost: 45000, price: 85000, margin: 88, stock: 180, trending: false, aiScore: 78, emoji: '🧕' },
  { id: 4, name: 'Kopi Arabika Gayo 250gr', supplier: 'Berkah Supplier', category: 'food', cost: 55000, price: 95000, margin: 72, stock: 320, trending: true, aiScore: 92, emoji: '☕' },
  { id: 5, name: 'Sepatu Sneaker Lokal', supplier: 'Shoe Factory', category: 'fashion', cost: 120000, price: 189000, margin: 57, stock: 75, trending: false, aiScore: 70, emoji: '👟' },
  { id: 6, name: 'Tas Ransel Kanvas', supplier: 'Bag Store', category: 'fashion', cost: 85000, price: 150000, margin: 76, stock: 120, trending: false, aiScore: 65, emoji: '🎒' },
  { id: 7, name: 'Serum Vitamin C', supplier: 'Beauty Lab', category: 'beauty', cost: 30000, price: 75000, margin: 150, stock: 400, trending: true, aiScore: 97, emoji: '✨' },
  { id: 8, name: 'Snack Box Premium', supplier: 'Snack Factory', category: 'food', cost: 25000, price: 45000, margin: 80, stock: 600, trending: false, aiScore: 72, emoji: '🍪' },
];

// ============ Supplier Data ============
const suppliers = [
  { id: 1, name: 'Toko Agung Jaya', rating: 4.9, orders: 1247, speed: 98, quality: 96, response: 99, badge: 'gold' },
  { id: 2, name: 'Berkah Supplier', rating: 4.8, orders: 983, speed: 95, quality: 94, response: 97, badge: 'silver' },
  { id: 3, name: 'Beauty Lab Premium', rating: 4.8, orders: 876, speed: 92, quality: 97, response: 95, badge: 'bronze' },
  { id: 4, name: 'Textile Indo Makmur', rating: 4.7, orders: 754, speed: 90, quality: 91, response: 93, badge: '' },
  { id: 5, name: 'Shoe Factory ID', rating: 4.6, orders: 621, speed: 88, quality: 89, response: 90, badge: '' },
  { id: 6, name: 'Snack Factory Jaya', rating: 4.5, orders: 543, speed: 85, quality: 88, response: 92, badge: '' },
  { id: 7, name: 'Bag Store Indonesia', rating: 4.5, orders: 432, speed: 87, quality: 86, response: 88, badge: '' },
  { id: 8, name: 'Herbal Nusantara', rating: 4.4, orders: 398, speed: 83, quality: 90, response: 85, badge: '' },
];

// ============ Render Products ============
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-category="${p.category}">
      <div class="card-image" style="background: var(--gray-100);">
        <span style="font-size: 4rem;">${p.emoji}</span>
        ${p.trending ? '<span class="trending-badge">🔥 Trending</span>' : ''}
        ${p.aiScore >= 85 ? '<span class="ai-badge">🤖 AI Pick</span>' : ''}
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
  `).join('');
}

function filterProducts(category) {
  renderProducts(category);
  
  // Update tab states
  document.querySelectorAll('#panel-recommendation .panel-tab').forEach(tab => {
    tab.classList.remove('active');
  });
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
      <div style="font-size:1.5rem;margin-right:4px;">${p.emoji}</div>
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
    
    if (marginPct >= 80) {
      status = '🟢 Sangat Baik'; statusClass = 'success'; recommendation = 'Pertahankan & Scale Up';
    } else if (marginPct >= 50) {
      status = '🟡 Baik'; statusClass = 'warning'; recommendation = 'Optimalkan Volume';
    } else {
      status = '🔴 Rendah'; statusClass = 'danger'; recommendation = 'Negosiasi Harga Supplier';
    }
    
    return `<tr>
      <td><div class="product-cell"><div class="product-thumb">${p.emoji}</div><div class="product-info"><div class="product-name">${p.name}</div></div></div></td>
      <td>${formatRupiah(p.cost)}</td>
      <td>${formatRupiah(p.price)}</td>
      <td><strong style="color:var(--primary);">${marginPct}%</strong> (${formatRupiah(profit)})</td>
      <td><span class="status-badge ${statusClass}">${status}</span></td>
      <td style="font-size:0.85rem;color:var(--gray-500);">${recommendation}</td>
    </tr>`;
  }).join('');
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
  
  // Color coding
  const profitEl = document.getElementById('profitPerUnit');
  if (profitPerUnit > 0) {
    profitEl.style.color = 'var(--accent-green)';
  } else {
    profitEl.style.color = 'var(--accent-red)';
  }
}

// ============ Validation Order ============
function validateOrder() {
  const product = document.getElementById('valProduct').value;
  const qty = parseInt(document.getElementById('valQty').value) || 0;
  const address = document.getElementById('valAddress').value.trim();
  
  if (!product) return;
  
  // Simulate validation
  setTimeout(() => {
    document.getElementById('vStock').innerHTML = qty <= 300 ? '<span class="v-status pass">✓ Tersedia</span>' : '<span class="v-status fail">✗ Stok Kurang</span>';
  }, 300);
  
  setTimeout(() => {
    document.getElementById('vSupplier').innerHTML = '<span class="v-status pass">✓ Aktif & Terverifikasi</span>';
  }, 600);
  
  setTimeout(() => {
    document.getElementById('vPrice').innerHTML = '<span class="v-status pass">✓ Harga Valid</span>';
  }, 900);
  
  setTimeout(() => {
    document.getElementById('vAddress').innerHTML = address.length > 5 ? '<span class="v-status pass">✓ Valid</span>' : '<span class="v-status fail">✗ Tidak Valid</span>';
  }, 1200);
  
  setTimeout(() => {
    document.getElementById('vEscrow').innerHTML = '<span class="v-status pass">✓ Siap</span>';
  }, 1500);
}

function submitValidation() {
  const product = document.getElementById('valProduct').value;
  if (!product) {
    showToast('Pilih produk terlebih dahulu!', 'warning');
    return;
  }
  
  showToast('Order berhasil divalidasi dan disubmit! 🎉', 'success');
  
  // Reset validation display
  setTimeout(() => {
    ['vStock', 'vSupplier', 'vPrice', 'vAddress', 'vEscrow'].forEach(id => {
      document.getElementById(id).innerHTML = '<span class="v-status pending">⏳ Menunggu</span>';
    });
    document.getElementById('valProduct').value = '';
  }, 2000);
}

// ============ Format Currency ============
function formatRupiah(num) {
  if (num >= 1000000) {
    return 'Rp ' + (num / 1000000).toFixed(1) + 'Jt';
  }
  return 'Rp ' + num.toLocaleString('id-ID');
}

// ============ Initialize Reseller Dashboard ============
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderTrending();
  renderSupplierRanking();
  renderMarginTable();
  calculateProfit();
});
