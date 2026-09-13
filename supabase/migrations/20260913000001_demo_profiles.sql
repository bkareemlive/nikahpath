-- Mark seed/demo accounts so they can be visibly labeled in the app,
-- distinct from real members.

alter table public.profiles
  add column if not exists is_demo boolean not null default false;

update public.profiles p
set is_demo = true
from auth.users u
where u.id = p.id
  and u.email like 'seed.%@nikahpath.dev';
