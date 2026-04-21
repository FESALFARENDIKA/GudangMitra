// Konfigurasi Supabase
// Gunakan CDN versi UMD di HTML (https://cdn.jsdelivr.net/npm/@supabase/supabase-js)

const supabaseUrl = 'https://nxoauoilhocafqwahfxt.supabase.co';
const supabaseKey = 'sb_publishable_M1ok6j9677xE5Llbdb43Gg_kJ2dTd7O';

// Initialize the Supabase client
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
