-- Shortlist: members can save a profile from Browse to revisit later.

create table public.saved_profiles (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  saved_id   uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, saved_id),
  check (user_id <> saved_id)
);
create index saved_profiles_saved_idx on public.saved_profiles (saved_id);

alter table public.saved_profiles enable row level security;

create policy "saved_profiles read own"
  on public.saved_profiles for select to authenticated
  using (user_id = auth.uid());

create policy "saved_profiles insert own"
  on public.saved_profiles for insert to authenticated
  with check (user_id = auth.uid());

create policy "saved_profiles delete own"
  on public.saved_profiles for delete to authenticated
  using (user_id = auth.uid());
