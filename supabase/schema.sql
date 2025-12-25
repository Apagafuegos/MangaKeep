-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS) for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Create Enum for Edition Types
create type edition_type as enum ('Standard', 'Omnibus', 'Deluxe', 'Digital');

-- Create manga_series table
-- This serves as a shared catalog of manga.
create table manga_series (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text,
  description text,
  cover_url text,
  anilist_id bigint unique, -- Optional link to AniList
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for manga_series
alter table manga_series enable row level security;

create policy "Manga series are viewable by everyone." on manga_series
  for select using (true);

create policy "Authenticated users can insert manga series." on manga_series
  for insert with check (auth.role() = 'authenticated');

-- Create user_volumes table
create table user_volumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  series_id uuid references manga_series on delete cascade not null,
  volume_number text not null, -- stored as text to handle "1-3" or "Vol. 1" variations if needed, though clean numbers preferred
  isbn text,
  language text default 'en',
  edition_type edition_type default 'Standard',
  is_read boolean default false,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for user_volumes
alter table user_volumes enable row level security;

create policy "Users can view their own volumes." on user_volumes
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own volumes." on user_volumes
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own volumes." on user_volumes
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own volumes." on user_volumes
  for delete using ((select auth.uid()) = user_id);

-- Function to handle new user creation
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
