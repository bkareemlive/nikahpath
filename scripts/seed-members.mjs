// Dev seed: create a handful of confirmed members with active profiles so the
// app has data to browse. Idempotent by email. Uses the REST API only (no
// supabase-js) so it runs on Node 20.
//
//   node scripts/seed-members.mjs
//
// Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.

import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) {
  console.error("Missing env in .env.local");
  process.exit(1);
}
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const PASSWORD = "SeedPass12345";

async function findUser(email) {
  const r = await fetch(`${URL_}/auth/v1/admin/users?per_page=1000`, { headers: H });
  const j = await r.json();
  return (j.users || []).find((u) => u.email === email);
}

const members = [
  { email: "seed.amina@nikahpath.dev", gender: "sister", alias: "Amina", dob: "2001-06-02", ethnicity: "Pakistani", country: "Canada", city: "Toronto", marital: "never_married", prayer: "five_daily", sect: "salafi", timeline: "12_months", relocate: "discuss", wants: "yes", height: 160, build: "Slim", wali_type: "family", wali_name: "Bilal", wali_relationship: "Brother", about: "Born and raised in Canada, alhamdulillah practising my whole life. Recently finished a nursing degree; my priority now is seeking beneficial knowledge and preparing for marriage. Cheerful, organised and a planner by nature.", looking_for: "A patient, gentle brother who is firm on the sunnah and kind in character." },
  { email: "seed.hafsa@nikahpath.dev", gender: "sister", alias: "Hafsa", dob: "2000-01-19", ethnicity: "Singaporean", country: "Singapore", city: "Singapore", marital: "never_married", prayer: "five_daily", sect: "sunni", timeline: "6_months", relocate: "within_country", wants: "yes", height: 158, build: "Average", wali_type: "family", wali_name: "Yusuf", wali_relationship: "Father", about: "Completed my hifdh at 19 and maintain it alongside a part-time role in web design. Family is everything to me; I am the eldest of four. I would like a husband who leads the household gently and helps me keep my Qur'an strong.", looking_for: "Someone striving in knowledge who wants a home where the Qur'an is recited daily." },
  { email: "seed.ruqayyah@nikahpath.dev", gender: "sister", alias: "Ruqayyah", dob: "1990-09-14", ethnicity: "Nigerian", country: "Nigeria", city: "Lagos", marital: "widowed", prayer: "five_daily", sect: "sunni", timeline: "no_rush", relocate: "no", wants: "have_enough", height: 167, build: "Average", wali_type: "family", wali_name: "Ibrahim", wali_relationship: "Brother", children: "One son, 6, lives with me.", about: "Widowed with one young son. I run a small halal skincare business from home. Easy-going and grateful, looking for a kind man who will be a father figure to my son and a companion for the sake of Allah.", looking_for: "A gentle, responsible man, settled in his deen, comfortable with a blended family." },
  { email: "seed.zaynab@nikahpath.dev", gender: "sister", alias: "Zaynab", dob: "2005-03-30", ethnicity: "Yemeni", country: "Jordan", city: "Amman", marital: "never_married", prayer: "five_daily", sect: "salafi", timeline: "asap", relocate: "yes", wants: "yes", height: 155, build: "Slim", wali_type: "family", wali_name: "Abdullah", wali_relationship: "Father", about: "Studying Islamic studies alongside an Arabic diploma. Quiet, patient and content with a simple life. I would love a husband who is studious and protective.", looking_for: "A studious brother firm on the deen who intends to make hijrah one day." },
  { email: "seed.mariam@nikahpath.dev", gender: "sister", alias: "Mariam", dob: "1996-11-05", ethnicity: "Algerian", country: "France", city: "Marseille", marital: "divorced", prayer: "most", sect: "sunni", timeline: "12_months", relocate: "within_country", wants: "yes", height: 168, build: "Curvy", wali_type: "independent", about: "Divorced, no children, ready to start again with the right intention. A teacher, independent and warm once you know me. I would like a home built on mutual mercy and shared worship.", looking_for: "A calm, honest man who values family and a peaceful home." },
  { email: "seed.yusuf@nikahpath.dev", gender: "brother", alias: "Yusuf", dob: "1996-02-10", ethnicity: "Pakistani", country: "United Kingdom", city: "London", marital: "never_married", prayer: "five_daily", sect: "salafi", timeline: "6_months", relocate: "yes", wants: "yes", height: 178, build: "Athletic", wali_type: "family", about: "Accountant, British-Pakistani, born Muslim and more serious about my practice over the last few years. I attend a weekly tafsir circle and have started learning Arabic. I would carry the household costs myself.", looking_for: "A practising sister, roughly 22-32, who prays on time and would like to settle in a Muslim country one day." },
  { email: "seed.bilal@nikahpath.dev", gender: "brother", alias: "Bilal", dob: "2000-07-22", ethnicity: "Somali", country: "United States", city: "Minneapolis", marital: "never_married", prayer: "five_daily", sect: "salafi", timeline: "asap", relocate: "discuss", wants: "yes", height: 183, build: "Athletic", wali_type: "family", about: "Born and raised in Minnesota, working as a personal trainer while I finish a sports science qualification. Quiet, disciplined and happy with a simple routine. I take the provider role seriously.", looking_for: "A practising sister with good character who wants to marry without unnecessary delay." },
  { email: "seed.idris@nikahpath.dev", gender: "brother", alias: "Dr Idris", dob: "1994-04-03", ethnicity: "Bosnian", country: "Bosnia and Herzegovina", city: "Sarajevo", marital: "never_married", prayer: "five_daily", sect: "sunni", timeline: "12_months", relocate: "discuss", wants: "yes", height: 180, build: "Average", wali_type: "family", about: "A junior doctor, born and raised in Sarajevo, the eldest of three. Easy-going and close to my family. I run, cook a lot and read history. What I want most is to be a husband and a father.", looking_for: "An open-minded, practising sister, university-educated, whose family can be involved when we are both comfortable." },
  { email: "seed.harun@nikahpath.dev", gender: "brother", alias: "Harun", dob: "1982-05-17", ethnicity: "Sudanese", country: "South Africa", city: "Cape Town", marital: "widowed", prayer: "five_daily", sect: "sunni", timeline: "no_rush", relocate: "no", wants: "open", height: 176, build: "Average", wali_type: "family", children: "Three children between 8 and 15.", about: "Widowed two years ago after a long marriage, three children. I work as a pharmacist and my late wife's family remain close and supportive.", looking_for: "A kind, patient wife to share the home and help raise the children with mercy." },
  { email: "seed.hamza@nikahpath.dev", gender: "brother", alias: "Hamza", dob: "1998-12-01", ethnicity: "Indian", country: "India", city: "Hyderabad", marital: "never_married", prayer: "five_daily", sect: "sunni", timeline: "6_months", relocate: "discuss", wants: "yes", height: 172, build: "Slim", wali_type: "family", about: "Hafidh of the Qur'an, teaching at a local institute. Gentle, patient and content with a modest life.", looking_for: "A practising sister who loves the Qur'an and wants a home where it is recited daily." },
];

let created = 0;
let updated = 0;

for (const m of members) {
  let userId;
  const mk = await fetch(`${URL_}/auth/v1/admin/users`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ email: m.email, password: PASSWORD, email_confirm: true }),
  });
  if (mk.ok) {
    userId = (await mk.json()).id;
    created++;
  } else {
    const existing = await findUser(m.email);
    if (!existing) {
      console.error("could not create/find", m.email, await mk.text());
      continue;
    }
    userId = existing.id;
  }

  const body = {
    status: "active",
    last_active_at: new Date().toISOString(),
    gender: m.gender,
    alias: m.alias,
    date_of_birth: m.dob,
    ethnicity: m.ethnicity,
    location_country: m.country,
    location_city: m.city,
    marital_status: m.marital,
    category: m.marital === "widowed" ? "widowed" : "standard",
    has_children: Boolean(m.children),
    children_note: m.children ?? null,
    practice_prayer: m.prayer,
    sect: m.sect,
    height_cm: m.height,
    build: m.build,
    timeline: m.timeline,
    relocate: m.relocate,
    wants_children: m.wants,
    wali_type: m.wali_type,
    wali_name: m.wali_name ?? null,
    wali_relationship: m.wali_relationship ?? null,
    about: m.about,
    looking_for: m.looking_for,
  };
  const up = await fetch(`${URL_}/rest/v1/profiles?id=eq.${userId}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(body),
  });
  if (up.ok) updated++;
  else console.error("profile update failed", m.email, await up.text());
}

console.log(`done. created ${created} users, updated ${updated} profiles.`);
