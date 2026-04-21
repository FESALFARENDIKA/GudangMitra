-- ==========================================
-- GUDANGMITRA - SUPABASE NUKER / RESETTER
-- ==========================================
-- Script ini akan menghapus tabel lama (jika ada) dan membuat ulang 
-- tabel yang bersih dengan struktur yang 100% benar.

-- 0. HAPUS TABEL LAMA BESERTA RELASINYA
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.supplier_profiles CASCADE;
DROP TABLE IF EXISTS public.academy_courses CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

create extension if not exists "uuid-ossp";

-- 1. USERS TABLE
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone text,
  store_name text,
  role text check (role in ('reseller', 'supplier', 'admin')) not null,
  join_date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SUPPLIERS INFO TABLE
create table public.supplier_profiles (
  user_id uuid references public.users(id) on delete cascade primary key,
  rating decimal(2,1) default 5.0,
  orders_completed integer default 0,
  speed_score integer default 100,
  quality_score integer default 100,
  response_score integer default 100,
  badge text default ''
);

-- 3. PRODUCTS TABLE
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  supplier_id uuid references public.users(id) on delete cascade,
  name text not null,
  category text not null,
  cost_price numeric not null,
  selling_price numeric not null,
  stock integer not null default 0,
  margin_percent integer,
  emoji text default '📦',
  image_url text,  -- Added natively
  validation_status text check (validation_status in ('pending', 'approved', 'rejected')) default 'pending',
  is_trending boolean default false,
  ai_score integer default 50,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. ORDERS / ESCROW TABLE
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  reseller_id uuid references public.users(id),
  supplier_id uuid references public.users(id),
  product_id uuid references public.products(id),
  qty integer not null,
  total_price numeric not null,
  shipping_address text not null,
  status text check (status in ('pending', 'paid_escrow', 'processing', 'shipped', 'completed', 'disputed')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. ACADEMY COURSES TABLE
create table public.academy_courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  category text not null,
  level text not null,
  duration text not null,
  author text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ENABLE ROW LEVEL SECURITY
alter table public.users enable row level security;
alter table public.supplier_profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.academy_courses enable row level security;

-- RLS Development Policies
create policy "Public Access users" on public.users for all using (true) with check (true);
create policy "Public Access supplier_profiles" on public.supplier_profiles for all using (true) with check (true);
create policy "Public Access products" on public.products for all using (true) with check (true);
create policy "Public Access orders" on public.orders for all using (true) with check (true);
create policy "Public Access academy" on public.academy_courses for all using (true) with check (true);

-- EXPLICIT GRANTS TO FIX PERMISSION DENIED ERRORS
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

-- Drop old trigger if exists
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Trigger Function
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, full_name, phone, store_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'store_name',
    new.raw_user_meta_data->>'role'
  );
  
  if new.raw_user_meta_data->>'role' = 'supplier' then
    insert into public.supplier_profiles(user_id) values (new.id);
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Drop old stock trigger if exists
drop trigger if exists on_order_created_reduce_stock on public.orders;
drop function if exists public.reduce_product_stock();

-- Trigger for Auto-Decrement Stock
create or replace function public.reduce_product_stock()
returns trigger as $$
begin
  update public.products
  set stock = stock - NEW.qty
  where id = NEW.product_id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_order_created_reduce_stock
  after insert on public.orders
  for each row execute procedure public.reduce_product_stock();

-----------------------------------------------------------
-- 5. SEEDING DUMMY PUSAT (Dummy Data)
-----------------------------------------------------------

insert into public.academy_courses (title, category, level, duration, author, image_url) values
('Mastering Dropship 2026', 'Bisnis', 'Pemula', '4 Jam', 'GudangMitra', 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80'),
('Optimasi SEO Marketplace', 'Marketing', 'Menengah', '3 Jam', 'GudangMitra', 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80'),
('Manajemen Keuangan Bisnis', 'Keuangan', 'Pemula', '2 Jam', 'GudangMitra', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80'),
('Scale Up 100x Orderan', 'Bisnis', 'Lanjut', '5 Jam', 'GudangMitra', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80');

insert into public.products (name, category, cost_price, selling_price, stock, margin_percent, image_url, validation_status, is_trending, ai_score) values
('Skincare Set Premium', 'beauty', 65000, 120000, 250, 84, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80', 'approved', true, 95),
('Kaos Polos Cotton 30s', 'fashion', 35000, 65000, 500, 85, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', 'approved', true, 89),
('Hijab Instan Premium', 'fashion', 45000, 85000, 180, 88, 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=400&q=80', 'approved', false, 78),
('Sepatu Sneaker Lokal', 'fashion', 120000, 189000, 75, 57, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', 'approved', false, 70);
