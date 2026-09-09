-- Seed the independent-wali register (mirrors src/data/walis.ts).
-- Safe to re-run.

insert into public.independent_walis
  (id, name, role, location, languages, years_serving, references_verified, availability, bio)
values
  ('00000000-0000-0000-0000-000000000001'::uuid,
   'Ustadh Abdullah Rahman', 'Imam, Green Lane Masjid area', 'Birmingham, United Kingdom',
   array['English','Urdu','Arabic'], 11, true, 'available',
   'Serves as an appointed Wali for sisters who have no Mahram available to act as their guardian. Experienced in vetting suitors, agreeing the contract and mahr, and attending the nikah. Works only through recorded, third-party channels.'),
  ('00000000-0000-0000-0000-000000000002'::uuid,
   'Dr Suleiman Diallo', 'Islamic centre trustee', 'Atlanta, United States',
   array['English','French'], 8, true, 'limited',
   'Community elder and former teacher. Familiar with the situation of reverts and sisters estranged from family. Insists on a clear scope of representation agreed in writing before acting.'),
  ('00000000-0000-0000-0000-000000000003'::uuid,
   'Shaykh Bilal Osman', 'Registered nikah officiant', 'Toronto, Canada',
   array['English','Arabic','Somali'], 15, true, 'available',
   'Has acted as Wali for many sisters over the years. Emphasises that his role is to safeguard the sister''s interests in the marriage contract, not to socialise, counsel privately, or pursue any personal interest.'),
  ('00000000-0000-0000-0000-000000000004'::uuid,
   'Imam Musa Adeyemi', 'Masjid imam', 'Lagos, Nigeria',
   array['English','Yoruba','Arabic'], 6, true, 'available',
   'Supports sisters across West Africa and the diaspora. Coordinates with a local imam wherever the sister lives so there is always someone able to attend the nikah in person.'),
  ('00000000-0000-0000-0000-000000000005'::uuid,
   'Shaykh Tariq Al-Hassan', 'Masjid imam', 'Amman, Jordan',
   array['Arabic','English'], 13, true, 'limited',
   'Serves sisters across the Levant and the Gulf. Requires the scope of representation and the mahr to be settled in writing before he will act.'),
  ('00000000-0000-0000-0000-000000000006'::uuid,
   'Ustaz Ridzuan Hakim', 'Syariah-registered nikah officiant', 'Kuala Lumpur, Malaysia',
   array['Malay','English','Arabic'], 19, true, 'full',
   'Not accepting new requests at present. Profile kept visible so sisters can see the standard expected. Referrals made to other listed Walis where possible.')
on conflict (id) do nothing;
