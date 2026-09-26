-- Unkillable production schema blueprint.
-- Apply to a dedicated Supabase project, then run security/performance advisors.
-- No service-role key is required by the browser application.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  goals text[] not null default '{}',
  disruptors text[] not null default '{}',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '',
  pillar text not null check (pillar in ('body','mind','discipline','recovery','relationships','purpose')),
  frequency text not null check (frequency in ('daily','weekdays','weekends','weekly')),
  target text not null,
  minimum_version text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table if not exists public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null,
  completion_date date not null,
  status text not null default 'complete' check (status in ('complete','missed','skipped')),
  value numeric,
  created_at timestamptz not null default now(),
  constraint habit_completions_habit_owner_fkey
    foreign key (habit_id, user_id)
    references public.habits(id, user_id)
    on delete cascade,
  unique (user_id, habit_id, completion_date)
);

create table if not exists public.minimum_days (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  created_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  week_starts_on text not null default 'monday' check (week_starts_on in ('monday','sunday')),
  reduced_motion boolean not null default false,
  reminders boolean not null default true,
  reminder_time time not null default '20:30',
  timezone text not null default 'UTC',
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  consistency smallint not null check (consistency between 0 and 100),
  strongest_pillar text check (strongest_pillar in ('body','mind','discipline','recovery','relationships','purpose')),
  weakest_pillar text check (weakest_pillar in ('body','mind','discipline','recovery','relationships','purpose')),
  wins text[] not null default '{}',
  focus text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','pro')),
  status text not null default 'inactive',
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists habits_user_created_idx on public.habits (user_id, created_at desc);
create index if not exists completions_user_date_idx on public.habit_completions (user_id, completion_date desc);
create index if not exists completions_habit_date_idx on public.habit_completions (habit_id, completion_date desc);
create index if not exists reviews_user_week_idx on public.weekly_reviews (user_id, week_start desc);

alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;
alter table public.minimum_days enable row level security;
alter table public.user_settings enable row level security;
alter table public.weekly_reviews enable row level security;
alter table public.subscriptions enable row level security;

revoke all on table public.profiles from anon;
revoke all on table public.habits from anon;
revoke all on table public.habit_completions from anon;
revoke all on table public.minimum_days from anon;
revoke all on table public.user_settings from anon;
revoke all on table public.weekly_reviews from anon;
revoke all on table public.subscriptions from anon;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.habits to authenticated;
grant select, insert, update, delete on table public.habit_completions to authenticated;
grant select, insert, delete on table public.minimum_days to authenticated;
grant select, insert, update on table public.user_settings to authenticated;
grant select, insert, update, delete on table public.weekly_reviews to authenticated;
grant select on table public.subscriptions to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "habits_select_own" on public.habits;
create policy "habits_select_own" on public.habits
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "habits_insert_own" on public.habits;
create policy "habits_insert_own" on public.habits
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "habits_update_own" on public.habits;
create policy "habits_update_own" on public.habits
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "habits_delete_own" on public.habits;
create policy "habits_delete_own" on public.habits
for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "completions_select_own" on public.habit_completions;
create policy "completions_select_own" on public.habit_completions
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "completions_insert_own" on public.habit_completions;
create policy "completions_insert_own" on public.habit_completions
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "completions_update_own" on public.habit_completions;
create policy "completions_update_own" on public.habit_completions
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "completions_delete_own" on public.habit_completions;
create policy "completions_delete_own" on public.habit_completions
for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "minimum_days_select_own" on public.minimum_days;
create policy "minimum_days_select_own" on public.minimum_days
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "minimum_days_insert_own" on public.minimum_days;
create policy "minimum_days_insert_own" on public.minimum_days
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "minimum_days_delete_own" on public.minimum_days;
create policy "minimum_days_delete_own" on public.minimum_days
for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "settings_select_own" on public.user_settings;
create policy "settings_select_own" on public.user_settings
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "settings_insert_own" on public.user_settings;
create policy "settings_insert_own" on public.user_settings
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "settings_update_own" on public.user_settings;
create policy "settings_update_own" on public.user_settings
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "reviews_select_own" on public.weekly_reviews;
create policy "reviews_select_own" on public.weekly_reviews
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "reviews_insert_own" on public.weekly_reviews;
create policy "reviews_insert_own" on public.weekly_reviews
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "reviews_update_own" on public.weekly_reviews;
create policy "reviews_update_own" on public.weekly_reviews
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "reviews_delete_own" on public.weekly_reviews;
create policy "reviews_delete_own" on public.weekly_reviews
for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
for select to authenticated
using ((select auth.uid()) = user_id);
