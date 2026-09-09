-- NikahPath initial schema
-- Halal marriage introduction service: profiles, independent-wali register,
-- interest requests, matches, chat.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Public reference number (F0001 / M0001), assigned when gender is first set
-- ---------------------------------------------------------------------------
create sequence if not exists public.member_ref_seq start 1000;

create or replace function public.assign_public_ref()
returns trigger
language plpgsql
as $$
begin
  if new.public_ref is null and new.gender is not null then
    new.public_ref :=
      case new.gender when 'sister' then 'F' else 'M' end
      || lpad(nextval('public.member_ref_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- independent_walis  (the appointed-wali register)
-- ---------------------------------------------------------------------------
create table public.independent_walis (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users (id) on delete set null,
  name                text not null,
  role                text not null,
  location            text not null,
  languages           text[] not null default '{}',
  years_serving       int  not null default 0,
  references_verified boolean not null default false,
  availability        text not null default 'available'
                        check (availability in ('available', 'limited', 'full')),
  bio                 text not null default '',
  active              boolean not null default true,
  created_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  role                text not null default 'member'
                        check (role in ('member', 'wali', 'admin')),
  status              text not null default 'draft'
                        check (status in ('draft', 'active', 'paused', 'hidden')),
  plan                text not null default 'free'
                        check (plan in ('free', 'full_access', 'lifetime')),
  plan_since          timestamptz,
  last_active_at      timestamptz,

  -- identity
  gender              text check (gender in ('sister', 'brother')),
  public_ref          text unique,
  alias               text,
  date_of_birth       date,
  ethnicity           text,
  location_country    text,
  location_city       text,

  -- situation
  marital_status      text check (marital_status in ('never_married', 'divorced', 'widowed')),
  category            text not null default 'standard'
                        check (category in ('standard', 'widowed')),
  has_children        boolean not null default false,
  children_note       text,

  -- practice
  practice_prayer     text,
  sect                text,

  -- physical (paid filters)
  height_cm           int check (height_cm between 120 and 230),
  build               text,

  -- essays
  about               text,
  looking_for         text,
  timeline            text,
  wants_children      text,
  relocate            text,

  -- guardian
  wali_type           text not null default 'family'
                        check (wali_type in ('family', 'independent', 'none_yet')),
  wali_name           text,
  wali_relationship   text,
  wali_contact        text,               -- revealed only to matched users, in-app
  independent_wali_id uuid references public.independent_walis (id) on delete set null
);

create index profiles_browse_idx
  on public.profiles (status, gender, category, last_active_at desc);
create index profiles_location_idx
  on public.profiles (location_country, location_city);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger profiles_assign_ref
  before insert or update on public.profiles
  for each row execute function public.assign_public_ref();

-- Create a profile row automatically for every new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- wali_requests  (a sister asks an independent wali to represent her)
-- ---------------------------------------------------------------------------
create table public.wali_requests (
  id             uuid primary key default gen_random_uuid(),
  sister_id      uuid not null references public.profiles (id) on delete cascade,
  wali_id        uuid not null references public.independent_walis (id) on delete cascade,
  status         text not null default 'pending'
                   check (status in ('pending', 'accepted', 'declined', 'withdrawn', 'ended')),
  message        text,
  scope_agreed   text,
  duration_agreed text,
  fee_agreed     text,
  created_at     timestamptz not null default now(),
  responded_at   timestamptz,
  unique (sister_id, wali_id)
);
create index wali_requests_wali_idx on public.wali_requests (wali_id, status);
create index wali_requests_sister_idx on public.wali_requests (sister_id, status);

-- ---------------------------------------------------------------------------
-- interest_requests
-- ---------------------------------------------------------------------------
create table public.interest_requests (
  id            uuid primary key default gen_random_uuid(),
  sender_id     uuid not null references public.profiles (id) on delete cascade,
  recipient_id  uuid not null references public.profiles (id) on delete cascade,
  status        text not null default 'pending'
                  check (status in ('pending', 'accepted', 'declined', 'withdrawn')),
  message       text,
  created_at    timestamptz not null default now(),
  responded_at  timestamptz,
  check (sender_id <> recipient_id),
  unique (sender_id, recipient_id)
);
create index interest_recipient_idx on public.interest_requests (recipient_id, status);
create index interest_sender_idx on public.interest_requests (sender_id, status);

-- ---------------------------------------------------------------------------
-- matches  (a<b so a pair has one row)
-- ---------------------------------------------------------------------------
create table public.matches (
  id                  uuid primary key default gen_random_uuid(),
  a_id                uuid not null references public.profiles (id) on delete cascade,
  b_id                uuid not null references public.profiles (id) on delete cascade,
  interest_request_id uuid references public.interest_requests (id) on delete set null,
  status              text not null default 'active'
                        check (status in ('active', 'closed')),
  wali_visible        boolean not null default true,
  created_at          timestamptz not null default now(),
  check (a_id < b_id),
  unique (a_id, b_id)
);
create index matches_a_idx on public.matches (a_id);
create index matches_b_idx on public.matches (b_id);

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------
create table public.messages (
  id         uuid primary key default gen_random_uuid(),
  match_id   uuid not null references public.matches (id) on delete cascade,
  sender_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  read_at    timestamptz
);
create index messages_match_idx on public.messages (match_id, created_at);

-- ---------------------------------------------------------------------------
-- profile_views  (paid: "see who viewed your profile")
-- ---------------------------------------------------------------------------
create table public.profile_views (
  viewer_id  uuid not null references public.profiles (id) on delete cascade,
  viewed_id  uuid not null references public.profiles (id) on delete cascade,
  viewed_at  timestamptz not null default now(),
  primary key (viewer_id, viewed_id),
  check (viewer_id <> viewed_id)
);
create index profile_views_viewed_idx on public.profile_views (viewed_id, viewed_at desc);

-- ---------------------------------------------------------------------------
-- nudges  (a light "still interested?" ping, rate-limited in app)
-- ---------------------------------------------------------------------------
create table public.nudges (
  id           uuid primary key default gen_random_uuid(),
  sender_id    uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  created_at   timestamptz not null default now(),
  check (sender_id <> recipient_id)
);
create index nudges_recipient_idx on public.nudges (recipient_id, created_at desc);

-- ---------------------------------------------------------------------------
-- RPC: accept an interest request -> create the match
-- ---------------------------------------------------------------------------
create or replace function public.accept_interest_request(request_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  req record;
  lo uuid;
  hi uuid;
  match_id uuid;
begin
  select * into req from public.interest_requests where id = request_id for update;
  if not found then
    raise exception 'request not found';
  end if;
  if req.recipient_id <> auth.uid() then
    raise exception 'not authorised';
  end if;
  if req.status <> 'pending' then
    raise exception 'request is % , not pending', req.status;
  end if;

  update public.interest_requests
     set status = 'accepted', responded_at = now()
   where id = request_id;

  lo := least(req.sender_id, req.recipient_id);
  hi := greatest(req.sender_id, req.recipient_id);

  insert into public.matches (a_id, b_id, interest_request_id)
  values (lo, hi, request_id)
  on conflict (a_id, b_id) do update set status = 'active'
  returning id into match_id;

  return match_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles          enable row level security;
alter table public.independent_walis enable row level security;
alter table public.wali_requests     enable row level security;
alter table public.interest_requests enable row level security;
alter table public.matches           enable row level security;
alter table public.messages          enable row level security;
alter table public.profile_views     enable row level security;
alter table public.nudges            enable row level security;

-- profiles: read active profiles + always your own; write only your own
create policy "profiles read active or own"
  on public.profiles for select
  to authenticated
  using (status = 'active' or id = auth.uid());

create policy "profiles insert own"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "profiles update own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- independent_walis: everyone signed in can read active ones; a listed wali
-- may edit their own row
create policy "walis read active"
  on public.independent_walis for select
  to authenticated
  using (active or user_id = auth.uid());

create policy "walis update own"
  on public.independent_walis for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- wali_requests: the sister owns her requests; the assigned wali can see and
-- respond to requests addressed to them
create policy "wali_requests sister read"
  on public.wali_requests for select
  to authenticated
  using (
    sister_id = auth.uid()
    or exists (
      select 1 from public.independent_walis w
      where w.id = wali_requests.wali_id and w.user_id = auth.uid()
    )
  );

create policy "wali_requests sister insert"
  on public.wali_requests for insert
  to authenticated
  with check (sister_id = auth.uid());

create policy "wali_requests sister or wali update"
  on public.wali_requests for update
  to authenticated
  using (
    sister_id = auth.uid()
    or exists (
      select 1 from public.independent_walis w
      where w.id = wali_requests.wali_id and w.user_id = auth.uid()
    )
  );

-- interest_requests: sender or recipient can read; sender inserts; either party
-- updates (recipient accepts/declines via RPC or direct; sender withdraws)
create policy "interest read own"
  on public.interest_requests for select
  to authenticated
  using (sender_id = auth.uid() or recipient_id = auth.uid());

create policy "interest insert as sender"
  on public.interest_requests for insert
  to authenticated
  with check (sender_id = auth.uid());

create policy "interest update by party"
  on public.interest_requests for update
  to authenticated
  using (sender_id = auth.uid() or recipient_id = auth.uid())
  with check (sender_id = auth.uid() or recipient_id = auth.uid());

-- matches: participants only; created via RPC (security definer bypasses RLS)
create policy "matches read participant"
  on public.matches for select
  to authenticated
  using (a_id = auth.uid() or b_id = auth.uid());

create policy "matches update participant"
  on public.matches for update
  to authenticated
  using (a_id = auth.uid() or b_id = auth.uid())
  with check (a_id = auth.uid() or b_id = auth.uid());

-- messages: only within a match you belong to
create policy "messages read in own match"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.matches m
      where m.id = messages.match_id
        and (m.a_id = auth.uid() or m.b_id = auth.uid())
    )
  );

create policy "messages insert in own match"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.matches m
      where m.id = messages.match_id
        and m.status = 'active'
        and (m.a_id = auth.uid() or m.b_id = auth.uid())
    )
  );

-- profile_views: you record your own views; you can read views of your profile
create policy "views insert as viewer"
  on public.profile_views for insert
  to authenticated
  with check (viewer_id = auth.uid());

create policy "views read own or of me"
  on public.profile_views for select
  to authenticated
  using (viewer_id = auth.uid() or viewed_id = auth.uid());

create policy "views update as viewer"
  on public.profile_views for update
  to authenticated
  using (viewer_id = auth.uid())
  with check (viewer_id = auth.uid());

-- nudges: sender inserts; sender or recipient reads
create policy "nudges insert as sender"
  on public.nudges for insert
  to authenticated
  with check (sender_id = auth.uid());

create policy "nudges read own"
  on public.nudges for select
  to authenticated
  using (sender_id = auth.uid() or recipient_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Realtime: broadcast message + match changes to participants
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.matches;
alter publication supabase_realtime add table public.interest_requests;
