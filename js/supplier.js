/* ============================================
   GudangMitra - Supplier Dashboard JavaScript
   ============================================ */

// ============ Validate Product ============
function validateProduct(sku) {
  showToast(`Memulai validasi produk ${sku}...`, 'info');
  
  setTimeout(() => {
    showToast(`Produk ${sku} berhasil divalidasi! ✓`, 'success');
    
    // Update the button
    const btn = event.target;
    if (btn) {
      btn.textContent = '✓ Valid';
      btn.className = 'btn btn-sm btn-outline';
      btn.style.color = 'var(--accent-green)';
      btn.style.borderColor = 'var(--accent-green)';
      btn.disabled = true;
      
      // Update status badge in same row
      const row = btn.closest('tr');
      if (row) {
        const badge = row.querySelector('.status-badge');
        if (badge) {
          badge.className = 'status-badge success';
          badge.textContent = '✓ Valid';
        }
      }
    }
  }, 1500);
}

// ============ Revalidate Product ============
function revalidateProduct(sku) {
  showToast(`Pengajuan ulang produk ${sku} telah dikirim.`, 'info');
  
  const btn = event.target;
  if (btn) {
    btn.textContent = '⏳ Pending';
    btn.disabled = true;
    
    const row = btn.closest('tr');
    if (row) {
      const badge = row.querySelector('.status-badge');
      if (badge) {
        badge.className = 'status-badge warning';
        badge.textContent = '⏳ Review';
      }
    }
  }
}

// ============ Add Product ============
function addProduct() {
  showToast('Fitur tambah produk - Silakan isi form produk baru.', 'info');
}

// ============ Process Order ============
function processOrder(orderId) {
  showToast(`Memproses order ${orderId}...`, 'info');
  
  setTimeout(() => {
    showToast(`Order ${orderId} berhasil diproses! 🚛`, 'success');
    
    const btn = event.target;
    if (btn) {
      btn.textContent = '🚛 Dikirim';
      btn.className = 'btn btn-sm btn-outline';
      btn.style.color = 'var(--accent-blue)';
      btn.style.borderColor = 'var(--accent-blue)';
      btn.disabled = true;
      
      const row = btn.closest('tr');
      if (row) {
        const badge = row.querySelector('.status-badge');
        if (badge) {
          badge.className = 'status-badge info';
          badge.textContent = '🚛 Dikirim';
        }
      }
    }
  }, 1000);
}

// ============ Init ============
document.addEventListener('DOMContentLoaded', () => {
  // Supplier-specific init
});
