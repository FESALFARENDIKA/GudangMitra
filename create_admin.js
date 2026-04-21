const supabaseUrl = 'https://nxoauoilhocafqwahfxt.supabase.co';
const supabaseKey = 'sb_publishable_M1ok6j9677xE5Llbdb43Gg_kJ2dTd7O';

async function createAdmin() {
  const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'admin@gudangmitra.com',
      password: 'adminpassword123',
      data: {
        role: 'admin',
        full_name: 'GudangMitra Admin',
        store_name: 'Admin Pusat'
      }
    })
  });
  
  const text = await res.text();
  console.log(text);
}

createAdmin();
