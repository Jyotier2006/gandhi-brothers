/**
 * Gandhi Brothers — Journal (blog) content.
 *
 * Source of truth for editorial articles. Pure data + helpers, no I/O — safe to
 * import from server components and the sitemap.
 *
 * Compliance: All copy is DMR Act 1954 / CCPA 2022 friendly — educational and
 * process-focused, with NO disease, treatment, or cure claims.
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date (published). */
  date: string;
  updated?: string;
  author: string;
  /** Cover image path under /public. */
  cover: string;
  readMinutes: number;
  tags: string[];
  body: ArticleBlock[];
}

export const articles: Article[] = [
  {
    slug: "what-fdca-licence-means",
    title: "What an FDCA Licence Means — and How to Tell an Ayurvedic Product Is Genuine",
    excerpt:
      "“FDCA licensed” appears on a lot of packs. Here's what the licence actually certifies, what to look for on a label, and how to verify that an Ayurvedic product was made accountably.",
    date: "2026-05-10",
    author: "Gandhi Brothers",
    cover: "/heritage/heritage-2013-licensed-manufacturer.png",
    readMinutes: 6,
    tags: ["Trust & Compliance", "Buying Guide"],
    body: [
      {
        type: "p",
        text: "If you have shopped for Ayurvedic products online, you have seen the phrase “FDCA licensed” on a lot of packaging. It sounds reassuring — but what does it actually mean, and how do you separate a genuinely accountable manufacturer from one that simply prints the words? Here is a plain-language guide.",
      },
      { type: "h2", text: "What the FDCA is" },
      {
        type: "p",
        text: "The Food and Drugs Control Administration (FDCA) is the state regulator in Gujarat responsible for licensing and inspecting drug and Ayurvedic manufacturers. In India, Ayurvedic medicines are regulated under the Drugs and Cosmetics Act, 1940 and its rules. A manufacturer cannot legally produce Ayurvedic preparations for sale without a manufacturing licence issued by their state authority.",
      },
      { type: "h2", text: "What a manufacturing licence certifies" },
      {
        type: "p",
        text: "Our licence — GA/2079, issued on Form 25D — certifies that our premises, equipment, water system, and processes were inspected and found fit to manufacture Ayurvedic medicines. It is tied to a specific list of products and a specific facility. It is not a one-time sticker; it is a standing obligation, subject to renewal and inspection.",
      },
      {
        type: "p",
        text: "Alongside the licence sits Schedule T of the Drugs and Cosmetics Rules, which lays down Good Manufacturing Practices (GMP) for Ayurvedic, Siddha and Unani medicines — covering hygiene, raw-material handling, record-keeping, and quality control.",
      },
      { type: "h2", text: "How to verify a product yourself" },
      {
        type: "p",
        text: "You do not need to take anyone's word for it. A genuinely made product gives you the information to check it:",
      },
      {
        type: "ul",
        items: [
          "A manufacturing licence number printed on the pack (ours reads GA/2079).",
          "The full name and address of the actual manufacturer — not just a marketing brand.",
          "A batch number and manufacturing/expiry dates, so a specific pack is traceable to a specific production run.",
          "A readable list of ingredients (the classical dravyas) and clear usage directions.",
          "Maximum retail price and net quantity, as required by law.",
        ],
      },
      {
        type: "p",
        text: "If a pack hides the manufacturer behind a brand name, omits a batch number, or makes dramatic promises, treat that as a reason to look more closely.",
      },
      { type: "h2", text: "Why traceability matters more than marketing" },
      {
        type: "p",
        text: "The point of a batch number is accountability. If a question is ever raised about a particular pack, the manufacturer can trace which raw materials went into it, when it was made, and who handled it. That discipline — boring as it sounds — is the real difference between a serious manufacturer and a label.",
      },
      {
        type: "quote",
        text: "A licence is a promise you can check. Look for the number, the manufacturer's name, and the batch code — then decide who to trust.",
      },
      {
        type: "p",
        text: "Every Gandhi Brothers pack carries our licence number, our Junagadh address, a batch code, and printed directions. That is not a marketing choice; it is what an FDCA licence asks of us.",
      },
      {
        type: "p",
        text: "Note: Ayurvedic products are best used under the guidance of a qualified Ayurvedic physician. This article is educational and is not medical advice.",
      },
    ],
  },
  {
    slug: "churna-vs-taila-explained",
    title: "Churna and Taila: The Two Classical Forms of Ayurveda, Explained",
    excerpt:
      "Powders and medicated oils are two of the oldest preparation forms in Ayurveda. Here's what each one is, how it is traditionally prepared, and how people choose between them.",
    date: "2026-04-22",
    author: "Gandhi Brothers",
    cover: "/heritage/heritage-1974-1989-hands-before-machines.png",
    readMinutes: 5,
    tags: ["Ayurveda Basics"],
    body: [
      {
        type: "p",
        text: "Ayurveda has many preparation forms, but two of the most familiar are the churna and the taila. If you are new to classical formulations, understanding the difference helps you read a catalogue with confidence.",
      },
      { type: "h2", text: "What is a churna?" },
      {
        type: "p",
        text: "A churna is a fine herbal powder. In the simplest case it is a single dried herb, cleaned and ground; more often it is a polyherbal blend, where several dravyas are combined in traditional proportions. The grinding and sieving matter: a well-made churna is milled to a consistent grade so the blend is even from the first spoon to the last.",
      },
      {
        type: "p",
        text: "Churnas are valued for being simple and adaptable. They are commonly taken with warm water, and the exact quantity and timing are printed on each pack — typically a small spoonful, once or twice a day, or as advised by your physician.",
      },
      { type: "h2", text: "What is a taila?" },
      {
        type: "p",
        text: "A taila is a medicated oil. It is made by slow-cooking herbs, herbal pastes, and liquids into a base oil — usually sesame — so the oil carries the properties of the herbs. This is a patient process: the cooking is done in stages and judged by traditional end-points, not a stopwatch.",
      },
      {
        type: "p",
        text: "Tailas are typically for external use, applied and gently massaged as directed on the pack. Because they are oil-based, they keep well when stored away from heat and light.",
      },
      { type: "h2", text: "How people choose between them" },
      {
        type: "ul",
        items: [
          "Form of use: churnas are usually taken internally with water; tailas are usually applied externally.",
          "Routine: a powder fits a daily kitchen routine; an oil fits a self-care or massage routine.",
          "Preference: some people simply prefer the convenience of one form over the other.",
        ],
      },
      {
        type: "p",
        text: "There is no universally “better” form — the right choice depends on the preparation and on guidance from a qualified Ayurvedic physician. The directions printed on each pack are your first reference.",
      },
      {
        type: "quote",
        text: "A churna is the herb made simple; a taila is the herb carried in oil. Both are classical, and both reward careful preparation.",
      },
      {
        type: "p",
        text: "You can browse our churnas and tailas in the shop, each available in more than one pack size. As always, this article is educational and not a substitute for professional medical advice.",
      },
    ],
  },
  {
    slug: "how-a-churna-is-made",
    title: "From Raw Dravya to Sealed Pouch: How a Churna Is Made",
    excerpt:
      "A churna looks simple in the pack. Getting there takes sourcing, cleaning, drying, grinding, sieving, blending, and a batch record. A walk through how we make ours in Junagadh.",
    date: "2026-03-15",
    author: "Gandhi Brothers",
    cover: "/heritage/heritage-1998-1999-sealed-pouch.png",
    readMinutes: 6,
    tags: ["Behind the Scenes"],
    body: [
      {
        type: "p",
        text: "A pouch of churna is one of the simplest-looking products in Ayurveda. That simplicity is earned. Here is the journey from raw material to the sealed pouch that reaches you — the way it has been done in our family's house in Junagadh, refined over three generations.",
      },
      { type: "h2", text: "1. Sourcing the dravya" },
      {
        type: "p",
        text: "It starts with the raw materials — the dravyas. Sourcing at origin matters: the same herb can vary in quality depending on where and how it was grown and dried. We select materials by their identity and grade before anything else happens.",
      },
      { type: "h2", text: "2. Cleaning and drying" },
      {
        type: "p",
        text: "Raw materials are cleaned to remove dust, grit, and foreign matter, then properly dried. Moisture is the enemy of a good powder — it affects both grinding and shelf life — so this unglamorous step decides a lot.",
      },
      { type: "h2", text: "3. Grinding and sieving" },
      {
        type: "p",
        text: "The dried material is ground and then sieved to a consistent particle grade. Sieving is what makes a churna feel even rather than gritty, and it ensures a polyherbal blend stays uniform rather than separating.",
      },
      { type: "h2", text: "4. Blending in classical proportions" },
      {
        type: "p",
        text: "For a polyherbal churna, the individual powders are weighed and blended in their traditional proportions. Consistency here is the whole point: the spoonful at the bottom of the pack should match the one at the top.",
      },
      { type: "h2", text: "5. The batch record" },
      {
        type: "p",
        text: "Every production run gets a batch number, recorded against the materials and dates that went into it. This is what makes a specific pack traceable — and it is a requirement of manufacturing under our FDCA licence.",
      },
      { type: "h2", text: "6. Packing and sealing" },
      {
        type: "p",
        text: "Finally the churna is packed and sealed, labelled with its name, composition, directions, batch number, dates, net quantity, and our manufacturer details. A sealed pouch protects the powder from moisture and keeps it honest until it reaches you.",
      },
      {
        type: "quote",
        text: "Most of making a good churna is the parts you never see — the sourcing, the drying, the sieving, the record. The pouch is just where it ends.",
      },
      {
        type: "p",
        text: "That discipline is why our packs carry a licence number and a batch code. This article is educational; please use any Ayurvedic preparation as directed and under qualified medical guidance.",
      },
    ],
  },
];

export function getAllArticles(): Article[] {
  return [...articles].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticleSlugs(): string[] {
  return articles.map((a) => a.slug);
}
