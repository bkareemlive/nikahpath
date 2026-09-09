-- Billing support + two RLS follow-ups.

-- ---------------------------------------------------------------------------
-- Stripe customer id on the profile (webhook writes it best-effort)
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists stripe_customer_id text;

create index if not exists profiles_stripe_customer_idx
  on public.profiles (stripe_customer_id);

-- ---------------------------------------------------------------------------
-- An assigned independent Wali can read the profile of a sister who has
-- requested him, even if she has paused it.
-- ---------------------------------------------------------------------------
create policy "profiles read for assigned wali"
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1
      from public.wali_requests wr
      join public.independent_walis w on w.id = wr.wali_id
      where wr.sister_id = profiles.id
        and w.user_id = auth.uid()
        and wr.status in ('pending', 'accepted')
    )
  );

-- ---------------------------------------------------------------------------
-- Recipient of a message may mark it read.
-- ---------------------------------------------------------------------------
create policy "messages mark read by recipient"
  on public.messages for update
  to authenticated
  using (
    sender_id <> auth.uid()
    and exists (
      select 1 from public.matches m
      where m.id = messages.match_id
        and (m.a_id = auth.uid() or m.b_id = auth.uid())
    )
  )
  with check (sender_id <> auth.uid());
