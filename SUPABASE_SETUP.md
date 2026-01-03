# Supabase Database Setup

Run the following SQL commands in your Supabase project's SQL Editor to set up the necessary tables and security policies.

```sql
-- Create a table for public user profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  phone text,
  role text check (role in ('citizen', 'admin')),
  department text, -- Only for admins
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies
-- 1. Public profiles are viewable by everyone (or just authenticated users, depending on privacy)
-- For this app, let's allow authenticated users to view profiles (needed for dashboard)
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

-- 2. Users can insert their own profile
create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- 3. Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Function to handle new user signup (optional, if you want to auto-create profiles for simple auth)
-- But since we are manually creating profiles in our register function to include phone/role, we might not strictly need a trigger for email/password.
-- However, for Google OAuth, a trigger is very helpful to ensure a profile exists.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, phone, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'citizen'), -- Default to citizen if not specified
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- COMPLAINTS TABLE SETUP
-- ==========================================

create table complaints (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  category text not null,
  department text,
  priority text default 'medium',
  description text,
  status text default 'pending' check (status in ('pending', 'in-progress', 'resolved', 'rejected')),
  latitude double precision,
  longitude double precision,
  address text,
  image_url text,
  ai_prediction jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table complaints enable row level security;

-- Policies for Complaints
-- 1. Citizens can view their own complaints
create policy "Citizens can view own complaints"
  on complaints for select
  using ( auth.uid() = user_id );

-- 2. Admins can view all complaints (assuming admin role check)
-- Note: This requires a way to check role in RLS. A common pattern is a helper function or checking public.profiles
create policy "Admins can view all complaints"
  on complaints for select
  using ( 
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 3. Citizens can insert their own complaints
create policy "Citizens can insert own complaints"
  on complaints for insert
  with check ( auth.uid() = user_id );

-- 4. Admins can update complaints (status, etc.)
create policy "Admins can update complaints"
  on complaints for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ==========================================
-- STORAGE SETUP (Run this in Storage > Buckets)
-- ==========================================
-- 1. Create a new public bucket named 'complaint-images'
-- 2. Add policies:
--    - SELECT: Enable for all (Public)
--    - INSERT: Enable for authenticated users
--    - UPDATE: Enable for authenticated users (owners)
```

## Google OAuth Setup
1. Go to **Authentication > Providers** in your Supabase Dashboard.
2. Enable **Google**.
3. You will need a **Client ID** and **Client Secret** from the [Google Cloud Console](https://console.cloud.google.com/).
4. Add the **Redirect URL** from Supabase to your Google Cloud Console credentials.
