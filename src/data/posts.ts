export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string; // ISO
  readingTime: string;
  theme: string; // grouping key for the Journal index
  featured?: boolean;
  body: string[]; // paragraphs / simple markdown-ish lines (## for headings, > for quote, - for list item)
};

export const journalThemes = [
  "Before you begin",
  "Finding the right person",
  "Rights and responsibilities",
  "After the nikah",
];

export const posts: Post[] = [
  {
    slug: "looking-without-losing-heart",
    theme: "Finding the right person",
    title: "Looking Without Losing Heart",
    excerpt:
      "The search for a spouse wears people down. A calmer, more deliberate way to go about it — and what the sunnah actually asks of us.",
    author: "Editorial team",
    date: "2025-11-18",
    readingTime: "6 min read",
    featured: true,
    body: [
      "Ask anyone a year into looking for a spouse and you will hear a version of the same tiredness: the conversations that go nowhere, the expectations that never quite line up, the feeling that everybody is searching and nobody is finding.",
      "The difficulty is not new, and the guidance for it is older still. The Prophet ﷺ said: \"A woman is married for four things: her wealth, her lineage, her beauty and her religion. So marry the one who is religious, may your hands be rubbed with dust.\" The hadith is quoted at people constantly. It is used as an actual filter far less often.",
      "## Start with yourself",
      "Before writing a list of what you want, it is worth asking honestly what you are bringing. Character is not a finishing touch on a marriage; it is the foundation of one. The people who marry without drama and stay married are rarely the most impressive on paper. They tend to be the ones who are clear about their deen, steady in their manners, and realistic about ordinary life.",
      "## Be specific, then be flexible",
      "Vague criteria produce vague results. \"Someone practising and kind\" describes thousands of people. Knowing that you need someone who prays on time, who wants children soon, who is willing to live near your parents — that actually narrows things. Hold the essentials firmly and the preferences loosely.",
      "> The aim is not someone with no faults. It is someone whose faults you can live beside, and who will help carry you both towards Jannah.",
      "## Bring the right people in early",
      "A Wali is not an obstacle to be managed. A father, brother or guardian who is there from the first serious conversation protects everyone and, in practice, speeds things up. So does a trusted married friend who can give you an outside read on someone you are starting to like too much to assess clearly.",
      "May Allah make it easy for everyone in the middle of this, and grant them a spouse who is a coolness to their eyes.",
    ],
  },
  {
    slug: "making-the-first-meeting-count",
    theme: "Finding the right person",
    title: "Making the First Meeting Count",
    excerpt:
      "The first sit-down carries hope and nerves in equal measure. How to prepare for it, what to actually talk about, and how to keep it useful.",
    author: "Editorial team",
    date: "2025-11-12",
    readingTime: "5 min read",
    body: [
      "For a lot of people, the first arranged meeting is the first proper conversation they have had with a potential spouse. The pressure to handle it well can quietly crowd out the reason you are there: working out whether this is someone you could build a life with.",
      "## Before the meeting",
      "Settle the format in advance. Who will be there, where, and for how long. A meeting with the guardian present, or a call with a family member nearby, takes the ambiguity out of it and lets both people relax into the conversation.",
      "Write down five things that genuinely matter to you and would be hard to compromise on — money, children, where you would live, extended family, how faith looks day to day. Those are the questions worth your limited time.",
      "## During the meeting",
      "Ask open questions and then listen. \"Tell me about a normal week for you\" reveals more than \"are you practising?\". Notice how someone speaks about their parents, their last job, people who have wronged them. Character shows in the margins.",
      "> You are not interviewing a candidate. You are both trying to answer one honest question: is there a basis here to keep going?",
      "## After the meeting",
      "Give yourself a day before deciding. Pray istikhara. Talk it through with someone who knows you well. A yes does not have to feel certain. It only has to be a sincere willingness to take the next step and learn more.",
    ],
  },
  {
    slug: "what-a-wife-is-owed",
    theme: "Rights and responsibilities",
    title: "What a Wife Is Owed",
    excerpt:
      "A marriage in Islam runs on rights and responsibilities. A plain look at what a wife is due — financially, emotionally and spiritually.",
    author: "Editorial team",
    date: "2025-10-29",
    readingTime: "7 min read",
    body: [
      "A husband who knows exactly what his wife is entitled to is in a much better position to give it willingly, rather than treat each right as something to be negotiated. So it is worth setting them out plainly.",
      "## Maintenance",
      "The husband is responsible for his wife's food, clothing and housing at a level reasonable for their situation. This does not depend on her income. If she chooses to contribute from her own money, that is her generosity — not his entitlement.",
      "## Kind treatment",
      "\"And live with them in kindness\" (Qur'an 4:19). Kind treatment is more than the absence of harm. It includes patience with her nature, gentleness in speech, help around the home as the Prophet ﷺ helped his family, and not airing her faults to others.",
      "## Presence, not just provision",
      "A wife has a right to her husband's time and attention, not only what he pays for. Companionship, affection and intimacy are part of the contract, not favours granted when it happens to be convenient.",
      "> A marriage where rights are demanded but not offered becomes a ledger. One where each person competes to give becomes a mercy.",
      "## Her worship",
      "He should make room for her prayer, encourage her learning, and never place himself between her and her Lord.",
    ],
  },
  {
    slug: "what-a-husband-is-owed",
    theme: "Rights and responsibilities",
    title: "What a Husband Is Owed",
    excerpt:
      "Both sets of rights are sacred. The ones owed to a husband are discussed less often — and understanding them helps a wife honour her side clearly.",
    author: "Editorial team",
    date: "2025-10-29",
    readingTime: "6 min read",
    body: [
      "The rights owed to a husband are spoken about less than those owed to a wife. That does not make them smaller, and knowing them helps a wife meet her side of the covenant with clarity rather than guesswork.",
      "## Cooperation in the home",
      "The household is a shared undertaking with the husband as its guardian. A wife's part in running it, raising upright children and keeping the home peaceful is one of the greatest supports she can give.",
      "## Guarding his trust",
      "This covers his wealth, his reputation, and the privacy of the marriage. What passes between spouses is an amanah, not material for conversation with friends or relatives.",
      "## Good companionship",
      "Just as a wife is owed affection and presence, so is a husband. A warm manner, gratitude for what he provides, and gentleness at the end of a hard day are part of the companionship the marriage rests on.",
      "> Rights run in both directions. The Prophet ﷺ said the best of you are the best to their families — and he said it to everyone in the house.",
    ],
  },
  {
    slug: "the-money-conversation",
    theme: "Before you begin",
    title: "The Money Conversation, Before the Nikah",
    excerpt:
      "Unromantic, and one of the most common reasons a promising match quietly stalls. An honest checklist for the financial side — brothers and sisters both.",
    author: "Editorial team",
    date: "2025-10-14",
    readingTime: "6 min read",
    body: [
      "Money is one of the least discussed and most decisive parts of getting married. A promising match will often slow to a halt because neither side wanted to raise it early, and by the time it comes up there is already disappointment attached.",
      "## For brothers",
      "You do not have to be wealthy. You do need a realistic plan for maintenance: somewhere to live, a stable income, and no debt you are keeping quiet about. Being straight about your situation in the first few conversations saves everyone months.",
      "## For sisters",
      "Know the standard of living you actually expect, and whether it matches the brothers you are speaking to. Clarity here is a kindness. If you intend to keep working, or to stop, say so early.",
      "## The mahr",
      "The mahr is the wife's right and should be something the husband can genuinely give, not a figure chosen to impress. A reasonable mahr paid in full is worth far more than a large one deferred with no real date.",
      "> Talking about money before the nikah is not unromantic. It is one of the clearest signs that both people are taking the marriage seriously.",
    ],
  },
  {
    slug: "ready-or-just-restless",
    theme: "Before you begin",
    title: "Ready, or Just Restless?",
    excerpt:
      "Being tired of being single is not the same as being ready to marry. Signs of one, and signs of the other.",
    author: "Editorial team",
    date: "2025-09-29",
    readingTime: "5 min read",
    body: [
      "Marriage carries a weight that other relationships do not, and it is worth asking, before you begin, whether you are ready for that weight — or whether you are simply worn out by being single, which is a different thing entirely.",
      "## Signs of readiness",
      "- You can support a household, or have a concrete near-term plan to.",
      "- You know your own faults well enough to warn someone about them.",
      "- You want marriage for the deen and for tranquillity, not mainly to satisfy family or the people around you.",
      "- You are willing to be inconvenienced for someone else, daily, for years.",
      "## Signs you might be restless, not ready",
      "- You are counting on marriage to fix a loneliness that follows you everywhere.",
      "- You have not told anyone in your life that you are looking, because you are not sure you are.",
      "- Your list of requirements is long, exact, and mostly about status.",
      "> Readiness is not a feeling of certainty. It is a settled willingness to take responsibility for another person's wellbeing.",
    ],
  },
  {
    slug: "keep-the-engagement-short",
    theme: "After the nikah",
    title: "Keep the Engagement Short",
    excerpt:
      "The searching is done, the families have met, the intention is clear. Why the stretch before the contract should be as brief as you can make it.",
    author: "Editorial team",
    date: "2025-09-26",
    readingTime: "4 min read",
    body: [
      "Once both families are satisfied and the intention is settled, what is left is the gap between agreement and contract. That gap should be short, and there are good reasons to treat it that way.",
      "## Keep it brief",
      "A long engagement serves almost no one. It gives the boundaries time to blur, doubts time to grow in the quiet, and outside opinions time to crowd in. When both sides are ready, set a date.",
      "## Keep it halal",
      "Before the nikah there is no marriage. That means no seclusion, no idle contact, and communication that stays purposeful and witnessed. Protecting this now protects the trust you will lean on later.",
      "## Keep it simple",
      "The barakah is in ease. The Prophet ﷺ said the marriage with the greatest blessing is the one with the least burden. A modest walimah you can afford beats a lavish one that starts the marriage in debt.",
    ],
  },
  {
    slug: "the-first-year-is-calibration",
    theme: "After the nikah",
    title: "The First Year Is Calibration",
    excerpt:
      "The walimah is over and the guests have gone home. What follows is the slow, ordinary work of turning two lives into one household.",
    author: "Editorial team",
    date: "2025-09-11",
    readingTime: "5 min read",
    body: [
      "After the walimah comes the part nobody photographs: two people learning each other's habits, moods and unspoken assumptions, and slowly working out how one household runs.",
      "## The first year is calibration",
      "Much of what feels like conflict early on is really just information you did not have yet. Assume good intent, and ask before you conclude.",
      "## Two families, not a merger",
      "You have each joined a new family, with new rights and new patience attached. Boundaries with in-laws are healthy and are best set kindly, together, and early — not argued out in the middle of a crisis.",
      "> A strong marriage is not one without friction. It is one where both people have decided, in advance, that the marriage itself is not up for renegotiation every time it gets hard.",
      "## Keep worship shared",
      "Pray together when you can. Read together. Make dua for each other by name. The couples who last tend to be the ones who kept turning towards Allah side by side.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
