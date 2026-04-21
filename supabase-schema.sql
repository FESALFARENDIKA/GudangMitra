-- GudangMitra Supabase Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE (Extended info, maps to auth.users)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone text,
  store_name text,
  role text check (role in ('reseller', 'supplier', 'admin')) not null,
  join_date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SUPPLIERS INFO TABLE
create table if not exists public.supplier_profiles (
  user_id uuid references public.users(id) on delete cascade primary key,
  rating decimal(2,1) default 5.0,
  orders_completed integer default 0,
  speed_score integer default 100,
  quality_score integer default 100,
  response_score integer default 100,
  badge text default ''
);

-- PRODUCTS TABLE
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  supplier_id uuid references public.users(id) on delete cascade,
  name text not null,
  category text not null,
  cost_price numeric not null,
  selling_price numeric not null,
  stock integer not null default 0,
  margin_percent integer,
  emoji text default '📦',
  validation_status text check (validation_status in ('pending', 'approved', 'rejected')) default 'pending',
  is_trending boolean default false,
  ai_score integer default 50,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ORDERS / ESCROW TABLE
create table if not exists public.orders (
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

-- ENABLE ROW LEVEL SECURITY
alter table public.users enable row level security;
alter table public.supplier_profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Create basic RLS policies allowing all access for now (Development Mode)
-- In production, these should be restricted based on auth.uid()
create policy "Allow public read access on users" on public.users for select using (true);
create policy "Allow authenticated insert on users" on public.users for insert with check (auth.role() = 'authenticated');
create policy "Allow individual update on users" on public.users for update using (auth.uid() = id);

create policy "Allow public read access on products" on public.products for select using (true);
create policy "Allow authenticated inserts on products" on public.products for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update on products" on public.products for update using (auth.role() = 'authenticated');

create policy "Allow authenticated access on orders" on public.orders for all using (auth.role() = 'authenticated');
create policy "Allow public read access on supplier_profiles" on public.supplier_profiles for select using (true);

-- Functions and Triggers
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
