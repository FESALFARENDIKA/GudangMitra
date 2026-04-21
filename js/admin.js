/* ============================================
   GudangMitra - Admin Dashboard JavaScript
   ============================================ */

// ============ Approve Product ============
function approveProduct(sku) {
  showToast(`Produk ${sku} berhasil di-approve! ✓`, 'success');
  
  const btn = event.target;
  if (btn) {
    const row = btn.closest('tr');
    if (row) {
      const td = row.querySelector('td:last-child');
      if (td) {
        td.innerHTML = '<span class="status-badge success">✓ Approved</span>';
      }
    }
  }
}

// ============ Reject Product ============
function rejectProduct(sku) {
  showToast(`Produk ${sku} ditolak.`, 'warning');
  
  const btn = event.target;
  if (btn) {
    const row = btn.closest('tr');
    if (row) {
      const td = row.querySelector('td:last-child');
      if (td) {
        td.innerHTML = '<span class="status-badge danger">✗ Ditolak</span>';
      }
    }
  }
}

// ============ Init ============
document.addEventListener('DOMContentLoaded', () => {
  // Admin-specific init
});
