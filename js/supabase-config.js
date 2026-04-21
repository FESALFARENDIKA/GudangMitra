// Konfigurasi Supabase
const supabaseUrl = 'https://nxoauoilhocafqwahfxt.supabase.co';
const supabaseKey = 'sb_publishable_M1ok6j9677xE5Llbdb43Gg_kJ2dTd7O';

// Initialize the Supabase client correctly avoiding global variable collision
const sbClient = window.supabase.createClient(supabaseUrl, supabaseKey);
window.sb = sbClient; // Gunakan window.sb sebagai client utama
