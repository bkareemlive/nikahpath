-- Member safety: blocking and reporting.

-- ---------------------------------------------------------------------------
-- blocks — A blocks B. Directional row; the app treats any block between two
-- people as mutual invisibility.
-- ---------------------------------------------------------------------------
create table public.blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
create index blocks_blocked_idx on public.blocks (blocked_id);

alter table public.blocks enable row level security;

create policy "blocks read own"
  on public.blocks for select to authenticated
  using (blocker_id = auth.uid() or blocked_id = auth.uid());

create policy "blocks insert own"
  on public.blocks for insert to authenticated
  with check (blocker_id = auth.uid());

create policy "blocks delete own"
  on public.blocks for delete to authenticated
  using (blocker_id = auth.uid());

-- ---------------------------------------------------------------------------
-- reports — captured for a moderator to review later.
-- ---------------------------------------------------------------------------
create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles (id) on delete set null,
  reported_id uuid not null references public.profiles (id) on delete cascade,
  reason      text not null check (reason in (
                'inappropriate', 'fake', 'harassment', 'not_serious',
                'off_platform', 'other')),
  detail      text,
  status      text not null default 'open'
                check (status in ('open', 'reviewing', 'actioned', 'dismissed')),
  created_at  timestamptz not null default now()
);
create index reports_status_idx on public.reports (status, created_at);

alter table public.reports enable row level security;

create policy "reports read own"
  on public.reports for select to authenticated
  using (reporter_id = auth.uid());

create policy "reports insert own"
  on public.reports for insert to authenticated
  with check (reporter_id = auth.uid());
