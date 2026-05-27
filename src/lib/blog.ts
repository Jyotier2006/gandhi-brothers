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
  {
    slug: "storing-ayurvedic-churnas-and-tailas",
    title: "How to Store Ayurvedic Churnas and Tailas So They Stay Fresh",
    excerpt:
      "Powders and medicated oils keep best under a few simple conditions. Here's how to store your Ayurvedic churnas and tailas at home, what shortens their life, and how to read the dates on the pack.",
    date: "2026-05-27",
    author: "Gandhi Brothers",
    cover: "/heritage/heritage-1950-house-at-girnar.png",
    readMinutes: 5,
    tags: ["Ayurveda Basics", "Buying Guide"],
    body: [
      {
        type: "p",
        text: "A good Ayurvedic preparation is made with care — and a little care at home keeps it that way. Churnas (powders) and tailas (oils) are both natural products with no synthetic preservatives, so how you store them genuinely affects how long they stay fresh. None of this is complicated; it just helps to know what to do.",
      },
      { type: "h2", text: "What shortens a natural product's life" },
      {
        type: "p",
        text: "Four everyday things work against herbal products: moisture, heat, direct light, and air. Moisture is the biggest culprit for powders — it causes clumping and spoils texture. Heat and light slowly dull aroma and, for oils, can encourage rancidity. Air exposure, over time, does the same. Storage is really just about keeping those four in check.",
      },
      { type: "h2", text: "Storing churnas (powders)" },
      {
        type: "ul",
        items: [
          "Keep the pouch or jar tightly closed; press the air out and reseal it after every use.",
          "Store in a cool, dry place away from direct sunlight — a cupboard shelf is ideal, not the windowsill.",
          "Always use a clean, dry spoon. A damp spoon introduces moisture that the whole pack will share.",
          "Keep it away from the stove and sink, where steam and splashes are constant.",
          "If you decant into a jar, choose an airtight one and keep the original label with its batch number and dates.",
        ],
      },
      { type: "h2", text: "Storing tailas (medicated oils)" },
      {
        type: "ul",
        items: [
          "Close the cap firmly and store upright, away from heat and direct light.",
          "Never let water get into the bottle — pour rather than dip, and keep the rim clean.",
          "A cool room shelf is fine; oils do not need refrigeration and can thicken if stored too cold.",
          "Use within the period indicated on the pack, and keep the bottle out of reach of children.",
        ],
      },
      { type: "h2", text: "Reading the dates on the pack" },
      {
        type: "p",
        text: "Every genuine pack carries a manufacturing date, a use-by or expiry indication, and a batch number. The batch number ties your specific pack to the production run it came from. Buy quantities you will realistically finish within the indicated period — that is exactly why we offer more than one pack size.",
      },
      { type: "h2", text: "Simple signs it is time to retire a product" },
      {
        type: "ul",
        items: [
          "A powder that has clumped hard or feels damp.",
          "An off or sour smell, or a noticeable change in colour.",
          "An oil that smells rancid or looks markedly different from when you opened it.",
        ],
      },
      {
        type: "quote",
        text: "Keep it dry, keep it closed, keep it out of the sun. Most of looking after a natural product is just that.",
      },
      {
        type: "p",
        text: "Stored well, a churna or taila stays true to how it left our house in Junagadh. This article is educational and is not medical advice — always follow the directions printed on the pack and the guidance of a qualified Ayurvedic physician.",
      },
    ],
  },
  {
    slug: "single-herb-vs-polyherbal-churna",
    title: "Single-Herb and Polyherbal Churnas: What's the Difference?",
    excerpt:
      "Some churnas are one herb; others blend several in classical proportions. Here's what sets them apart, how to read a composition list, and how people choose between them.",
    date: "2026-05-24",
    author: "Gandhi Brothers",
    cover: "/heritage/heritage-late-1980s-first-machine.png",
    readMinutes: 5,
    tags: ["Ayurveda Basics"],
    body: [
      {
        type: "p",
        text: "Browse any Ayurvedic catalogue and you will see two kinds of churna: single-herb powders named after one dravya, and polyherbal blends with a classical name of their own. Knowing the difference makes a catalogue much easier to read.",
      },
      { type: "h2", text: "Single-herb churnas" },
      {
        type: "p",
        text: "A single-herb churna is exactly that — one herb, cleaned, dried and ground to a fine, even powder. Names like Ashwagandha Churna, Brahmi Churna, or Triphala's component herbs fall here (Triphala itself is a blend of three). The appeal is simplicity and transparency: you know precisely what is in the pack, and it can be used on its own or as advised.",
      },
      { type: "h2", text: "Polyherbal churnas" },
      {
        type: "p",
        text: "A polyherbal churna combines several dravyas in fixed, traditional proportions to make a named formulation — for example Sitopaladi, Avipattikar, Hingvashtak, or Sudarshan churna. These recipes come from the classical Ayurvedic texts, where the proportions are part of the formulation itself, not a modern marketing choice.",
      },
      {
        type: "p",
        text: "Making a polyherbal churna well is largely about consistency: each component is milled to grade, weighed, and blended so the mixture is uniform — the spoonful at the bottom of the pack should match the one at the top.",
      },
      { type: "h2", text: "How to read a composition list" },
      {
        type: "ul",
        items: [
          "A single-herb pack lists one botanical, usually with its Sanskrit and botanical name.",
          "A polyherbal pack lists each ingredient, often with the quantity or proportion of each.",
          "Either way, a genuine pack also shows the manufacturer, a batch number, dates, and directions.",
        ],
      },
      { type: "h2", text: "How people choose" },
      {
        type: "p",
        text: "There is no “better” category — single-herb and polyherbal churnas simply serve different purposes. A classical formulation is chosen when you want that specific traditional recipe; a single herb is chosen for simplicity or when a physician recommends it. As always, the right choice depends on guidance from a qualified Ayurvedic practitioner and the directions on the pack.",
      },
      {
        type: "quote",
        text: "A single-herb churna tells you one thing plainly; a polyherbal churna carries a classical recipe. Both are only as good as the milling and the proportions behind them.",
      },
      {
        type: "p",
        text: "You can see both kinds in our shop, each in more than one pack size. This article is educational and not a substitute for professional medical advice.",
      },
    ],
  },
  {
    slug: "sesame-oil-base-ayurvedic-taila",
    title: "Why Sesame Oil Is the Classic Base for Ayurvedic Tailas",
    excerpt:
      "Most traditional medicated oils start from sesame oil. Here's the role a base oil plays in a taila, why sesame (til) became the default in classical Ayurveda, and how the oil is prepared.",
    date: "2026-05-20",
    author: "Gandhi Brothers",
    cover: "/heritage/heritage-1950-1973-first-25-years.png",
    readMinutes: 6,
    tags: ["Ayurveda Basics", "Behind the Scenes"],
    body: [
      {
        type: "p",
        text: "If you read the ingredients on a medicated oil, the base is almost always sesame oil — til taila. That is not a coincidence. In classical Ayurveda, the base oil is itself a considered choice, and sesame has long been the default. Here is why.",
      },
      { type: "h2", text: "What a base oil does in a taila" },
      {
        type: "p",
        text: "A taila is made by cooking herbs, herbal pastes and liquids into a base oil so the oil carries the prepared herbs. In Ayurvedic terms the base oil is the sneha — the fatty medium that holds and carries the preparation. The choice of base affects texture, how the finished oil feels, and how well it keeps.",
      },
      { type: "h2", text: "Why sesame became the classical default" },
      {
        type: "p",
        text: "Classical texts treat sesame oil as the standard sneha unless a formulation calls for something else. Practically, it is a stable, widely available oil that stands up to the long, staged cooking a taila requires, and it blends smoothly into the finished preparation. Generations of preparers worked with it, and the methods were written around it.",
      },
      {
        type: "p",
        text: "Other bases do appear — coconut oil and others are used where a specific recipe or regional practice calls for them — but sesame remains the reference point most classical tailas are built on.",
      },
      { type: "h2", text: "How the oil is prepared" },
      {
        type: "p",
        text: "Making a taila is a patient, staged process: the herbal materials are cooked into the oil over time and judged by traditional end-points rather than a clock. Done properly, the water content is driven off and the oil takes on the character of the herbs without scorching. It is slow work, which is exactly why a well-made taila is worth seeking out.",
      },
      { type: "h2", text: "A note on storage" },
      {
        type: "p",
        text: "Because tailas are oil-based, they keep well when stored away from heat and light with the cap closed. Keep water out of the bottle and use within the period shown on the pack.",
      },
      {
        type: "quote",
        text: "In a taila, the oil is not just a carrier — it is part of the formulation. Sesame earned its place as the classic base over a very long time.",
      },
      {
        type: "p",
        text: "You can browse our tailas in the shop. This article is educational and is not medical advice; please use any preparation as directed and under qualified guidance.",
      },
    ],
  },
  {
    slug: "ayurveda-in-junagadh-gandhi-brothers-heritage",
    title: "Ayurveda in Junagadh: Three Generations of Gandhi Brothers",
    excerpt:
      "From a house at the foot of Girnar in 1950 to a licensed manufacturing facility today, the story of how Gandhi Brothers has made classical Ayurvedic preparations in Junagadh for three generations.",
    date: "2026-05-16",
    author: "Gandhi Brothers",
    cover: "/heritage/heritage-2023-factory-gomti-bhavan.png",
    readMinutes: 6,
    tags: ["Heritage"],
    body: [
      {
        type: "p",
        text: "Junagadh sits at the foot of Girnar, a place woven into Gujarat's long relationship with traditional medicine. It is where our family began making Ayurvedic preparations in 1950, and where we still make them today. This is a short history of Gandhi Brothers — and of how a home practice became a licensed manufacturer.",
      },
      { type: "h2", text: "1950: a house at Girnar" },
      {
        type: "p",
        text: "It started in a house at the foot of Girnar. The first preparations were made by hand, in small quantities, the way classical churnas and tailas had always been made — sourcing dravyas, cleaning and drying them, grinding, sieving, and blending in traditional proportions. The scale was modest; the standards were not.",
      },
      { type: "h2", text: "The first decades: hands before machines" },
      {
        type: "p",
        text: "For many years the work was done by hand. That period taught the things no machine teaches — how a properly dried herb should feel, what an even churna looks like, when a taila has cooked enough. Those judgements, passed from one generation to the next, are still the backbone of how we work.",
      },
      { type: "h2", text: "Late 1980s onward: the first machines" },
      {
        type: "p",
        text: "As demand grew, the first machines arrived. Mechanising the grinding and sieving improved consistency and let us make more without changing the recipes or the proportions. The aim was never to industrialise the craft — only to do the same careful work more reliably.",
      },
      { type: "h2", text: "2013: a licensed manufacturer" },
      {
        type: "p",
        text: "In time the practice became a formally licensed Ayurvedic manufacturer, holding FDCA licence GA/2079. Licensing meant inspected premises, documented processes, batch records, and accountability for every pack — a standing obligation rather than a one-time stamp. It is the difference between a recipe and a regulated product.",
      },
      { type: "h2", text: "Today: Gomti Bhavan, Junagadh" },
      {
        type: "p",
        text: "Today we make our churnas and tailas at our facility in Junagadh and ship them across India, while staying true to the classical methods the family started with. Three generations on, the through-line is the same: source well, prepare patiently, label honestly, and let the work speak.",
      },
      {
        type: "quote",
        text: "From a house at the foot of Girnar to a licensed facility in Junagadh — the scale changed; the standards did not.",
      },
      {
        type: "p",
        text: "You can read more on our Heritage page or browse the catalogue in the shop. This article is about our history and is not medical advice.",
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
