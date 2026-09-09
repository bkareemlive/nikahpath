// Shared option lists for the profile form and (later) the browse filters.

export const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "New Zealand",
  "Ireland",
  "France",
  "Germany",
  "Netherlands",
  "Belgium",
  "Sweden",
  "Norway",
  "Denmark",
  "Spain",
  "Portugal",
  "Italy",
  "Bosnia and Herzegovina",
  "Türkiye",
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Jordan",
  "Egypt",
  "Morocco",
  "Algeria",
  "Tunisia",
  "Libya",
  "Sudan",
  "Nigeria",
  "Ghana",
  "Kenya",
  "Tanzania",
  "Somalia",
  "South Africa",
  "Senegal",
  "Pakistan",
  "India",
  "Bangladesh",
  "Sri Lanka",
  "Afghanistan",
  "Malaysia",
  "Indonesia",
  "Singapore",
  "Brunei",
  "Japan",
  "Kyrgyzstan",
  "Kazakhstan",
  "Other",
] as const;

export const PRACTICE_PRAYER_OPTIONS = [
  { value: "five_daily", label: "All five daily prayers" },
  { value: "most", label: "Most prayers, working on consistency" },
  { value: "learning", label: "Still building the habit" },
] as const;

export const SECT_OPTIONS = [
  { value: "sunni", label: "Sunni" },
  { value: "salafi", label: "Salafi / Athari" },
  { value: "sufi", label: "Sunni with a Sufi leaning" },
  { value: "just_muslim", label: "Just Muslim" },
  { value: "other", label: "Other / prefer to explain" },
] as const;

export const MARITAL_OPTIONS = [
  { value: "never_married", label: "Never married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
] as const;

export const BUILD_OPTIONS = [
  "Slim",
  "Athletic",
  "Average",
  "Curvy",
  "Broad",
  "Prefer not to say",
] as const;

export const TIMELINE_OPTIONS = [
  { value: "asap", label: "As soon as we are both sure" },
  { value: "6_months", label: "Within about six months" },
  { value: "12_months", label: "Within a year" },
  { value: "no_rush", label: "No fixed timeline" },
] as const;

export const RELOCATE_OPTIONS = [
  { value: "yes", label: "Yes, open to relocating" },
  { value: "within_country", label: "Within my country only" },
  { value: "no", label: "No, I need to stay where I am" },
  { value: "discuss", label: "Willing to discuss it" },
] as const;

export const WANTS_CHILDREN_OPTIONS = [
  { value: "yes", label: "Yes, in shaa Allah" },
  { value: "open", label: "Open to it" },
  { value: "have_enough", label: "Have children, not seeking more" },
  { value: "no", label: "No" },
] as const;

export const WALI_TYPE_OPTIONS = [
  {
    value: "family",
    label: "A family guardian",
    hint: "My father, brother or another mahram will represent me.",
  },
  {
    value: "independent",
    label: "An appointed (independent) Wali",
    hint: "I have no family Wali available and will choose one from the register.",
  },
  {
    value: "none_yet",
    label: "Not sorted yet",
    hint: "I will arrange this before things get serious.",
  },
] as const;

export type OptionValue<T extends readonly { value: string }[]> =
  T[number]["value"];
