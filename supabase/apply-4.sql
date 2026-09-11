-- Admin dashboard: RLS access for the existing profiles.role = 'admin'
-- members to triage reports and suspend members. (No client action ever
-- writes profiles.role, so it can only be granted from the SQL editor.)

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- profiles — admins can see and moderate every profile, not just active
-- ones (the existing "select using (status = 'active' or id = auth.uid())"
-- policy stays as-is for regular members).
-- ---------------------------------------------------------------------------
create policy "profiles read by admin"
  on public.profiles for select to authenticated
  using (public.is_admin());

create policy "profiles update by admin"
  on public.profiles for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

alter table public.profiles drop constraint if exists profiles_status_check;
alter table public.profiles add constraint profiles_status_check
  check (status in ('draft', 'active', 'paused', 'hidden', 'suspended'));

-- ---------------------------------------------------------------------------
-- reports — admins can read the full queue and change its status.
-- ---------------------------------------------------------------------------
create policy "reports read by admin"
  on public.reports for select to authenticated
  using (public.is_admin());

create policy "reports update by admin"
  on public.reports for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- blocks — visible to admins for context on a report (e.g. did the
-- reporter already block this member).
-- ---------------------------------------------------------------------------
create policy "blocks read by admin"
  on public.blocks for select to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Make yourself the first admin (run once, after this migration):
--
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'you@example.com');
-- ---------------------------------------------------------------------------
