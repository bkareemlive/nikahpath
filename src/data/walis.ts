export type IndependentWali = {
  id: string;
  name: string;
  role: string;
  location: string;
  languages: string[];
  yearsServing: number;
  referencesVerified: boolean;
  availability: "Available" | "Limited" | "Full";
  bio: string;
};

export const independentWalis: IndependentWali[] = [
  {
    id: "W-014",
    name: "Ustadh Abdullah Rahman",
    role: "Imam, Green Lane Masjid area",
    location: "Birmingham, United Kingdom",
    languages: ["English", "Urdu", "Arabic"],
    yearsServing: 11,
    referencesVerified: true,
    availability: "Available",
    bio: "Serves as an appointed Wali for sisters who have no Mahram available to act as their guardian. Experienced in vetting suitors, agreeing the contract and mahr, and attending the nikah. Works only through recorded, third-party channels.",
  },
  {
    id: "W-021",
    name: "Dr Suleiman Diallo",
    role: "Islamic centre trustee",
    location: "Atlanta, United States",
    languages: ["English", "French"],
    yearsServing: 8,
    referencesVerified: true,
    availability: "Limited",
    bio: "Community elder and former teacher. Familiar with the situation of reverts and sisters estranged from family. Insists on a clear scope of representation agreed in writing before acting.",
  },
  {
    id: "W-030",
    name: "Shaykh Bilal Osman",
    role: "Registered nikah officiant",
    location: "Toronto, Canada",
    languages: ["English", "Arabic", "Somali"],
    yearsServing: 15,
    referencesVerified: true,
    availability: "Available",
    bio: "Has acted as Wali for many sisters over the years. Emphasises that his role is to safeguard the sister's interests in the marriage contract, not to socialise, counsel privately, or pursue any personal interest.",
  },
  {
    id: "W-037",
    name: "Imam Musa Adeyemi",
    role: "Masjid imam",
    location: "Lagos, Nigeria",
    languages: ["English", "Yoruba", "Arabic"],
    yearsServing: 6,
    referencesVerified: true,
    availability: "Available",
    bio: "Supports sisters across West Africa and the diaspora. Coordinates with a local imam wherever the sister lives so there is always someone able to attend the nikah in person.",
  },
  {
    id: "W-045",
    name: "Shaykh Tariq Al-Hassan",
    role: "Masjid imam",
    location: "Amman, Jordan",
    languages: ["Arabic", "English"],
    yearsServing: 13,
    referencesVerified: true,
    availability: "Limited",
    bio: "Serves sisters across the Levant and the Gulf. Requires the scope of representation and the mahr to be settled in writing before he will act.",
  },
  {
    id: "W-050",
    name: "Ustaz Ridzuan Hakim",
    role: "Syariah-registered nikah officiant",
    location: "Kuala Lumpur, Malaysia",
    languages: ["Malay", "English", "Arabic"],
    yearsServing: 19,
    referencesVerified: true,
    availability: "Full",
    bio: "Not accepting new requests at present. Profile kept visible so sisters can see the standard expected. Referrals made to other listed Walis where possible.",
  },
];

export const independentWaliRules = [
  {
    title: "Scope is the marriage contract, nothing more",
    body: "An appointed Wali vets the suitor, agrees the mahr and conditions, gives or withholds consent to the marriage, and is present or represented at the nikah. He does not take on any other role in the sister's life.",
  },
  {
    title: "No seclusion, no private familiarity",
    body: "All contact is for the purpose at hand and takes place through recorded channels or with a third party present. There is no one-to-one socialising, private counselling, or informal messaging.",
  },
  {
    title: "He cannot be a suitor",
    body: "If a listed Wali has any personal interest in the sister, he must decline the request and she chooses another. A Wali may not marry the woman he is representing while acting in that capacity.",
  },
  {
    title: "Grounded in the Sunnah",
    body: "The service follows the position that a woman with no Wali has one appointed for her, as in the words of the Prophet Muhammad ﷺ, \"there is no marriage without a Wali\" and \"the authority is the Wali of the one who has no Wali.\" Where no Islamic authority is available, a trustworthy Muslim man such as a local imam takes that place.",
  },
  {
    title: "The sister stays in control",
    body: "She chooses the Wali from the register, may ask him questions before confirming, and may replace him at any point for any reason. The Wali acts on her behalf and in her interest, not over her.",
  },
  {
    title: "Both sides agree in writing",
    body: "Before he acts, the Wali and the sister confirm the scope, the duration, and any fee (many serve without charge) through the app, so expectations are clear on both sides.",
  },
];
