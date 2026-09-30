create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  age int, gender text, height numeric, current_weight numeric, target_weight numeric,
  fitness_goal text, activity_level text default 'moderate',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles readable by signed-in" on public.profiles for select to authenticated using (true);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null, target_weight numeric not null, daily_calories int,
  macros jsonb, pace text not null default 'normal', status text not null default 'active',
  created_at timestamptz not null default now()
);
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete cascade,
  week_number int not null default 1, start_date date not null default current_date,
  daily_plans jsonb not null default '[]',
  created_at timestamptz not null default now()
);
create table public.wellness_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  energy text not null, mood text not null, sleep text not null,
  cramps text not null default 'none', discomfort text not null default 'none', notes text,
  created_at timestamptz not null default now(), unique (user_id, date)
);
create table public.cycle_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  start_date date not null, end_date date,
  created_at timestamptz not null default now()
);
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null, content text not null,
  created_at timestamptz not null default now()
);
do $$ declare t text; begin
  foreach t in array array['goals','plans','wellness_checkins','cycle_entries','chat_messages'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "own rows" on public.%I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  end loop; end $$;

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null, image text,
  created_at timestamptz not null default now()
);
create table public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (post_id, user_id)
);
create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null, created_at timestamptz not null default now()
);
do $$ declare t text; begin
  foreach t in array array['posts','post_likes','post_comments'] loop
    execute format('grant select, insert, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "read all" on public.%I for select to authenticated using (true)', t);
    execute format('create policy "insert own" on public.%I for insert to authenticated with check (auth.uid() = user_id)', t);
    execute format('create policy "delete own" on public.%I for delete to authenticated using (auth.uid() = user_id)', t);
  end loop; end $$;