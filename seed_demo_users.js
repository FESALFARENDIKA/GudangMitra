const supabaseUrl = 'https://nxoauoilhocafqwahfxt.supabase.co';
const supabaseKey = 'sb_publishable_M1ok6j9677xE5Llbdb43Gg_kJ2dTd7O';

async function signupUser(email, password, metadata) {
  console.log(`Menyiapkan akun: ${email}...`);
  const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
      data: metadata
    })
  });
  
  const data = await res.json();
  if (data.error) {
    console.error(`Gagal membuat ${email}:`, data.error.message);
  } else {
    console.log(`Sukses membuat ${email}!`);
  }
}

async function seed() {
  await signupUser('admin@gudangmitra.com', 'adminpassword123', {
    role: 'admin',
    full_name: 'GudangMitra Admin',
    store_name: 'Pusat Admin'
  });

  await signupUser('supplier@demo.com', 'demo123', {
    role: 'supplier',
    full_name: 'Supplier Demo',
    store_name: 'Toko Supplier Demo'
  });

  await signupUser('reseller@demo.com', 'demo123', {
    role: 'reseller',
    full_name: 'Reseller Demo',
    store_name: 'Toko Reseller Demo'
  });

  console.log("\nSemua akun demo telah diproses.");
}

seed();
