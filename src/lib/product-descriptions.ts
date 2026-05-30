/**
 * Gandhi Brothers — Product Marketing Copy
 *
 * Source of truth for product detail page content.
 * Keyed by SKU code (matches the [PP/PPP] prefix in the batch code system).
 *
 * Pricing, stock, and pack sizes still come from the Google Sheet.
 * This file holds the marketing-first long-form copy.
 *
 * Compliance: All copy is DMR Act 1954 / CCPA 2022 compliant — no disease
 * claims, no targeted health condition language. Manufactured under FDCA
 * Gujarat Ayurvedic licence GA/2079, Form 25D.
 */

export interface ProductDescription {
  sku: string;
  name: string;
  tagline: string;
  packSizes: string;
  intro: string[]; // Array of paragraphs
  whatsInThePack: string;
  howToUse: string;
  cautions: string;
  classification: string;
  hsnCode: string;
  gst: string;
}

export const productDescriptions: Record<string, ProductDescription> = {
  // ========================================================================
  // SECTION A — GANDHI PROPRIETARY RANGE (12 products)
  // ========================================================================

  DBC: {
    sku: "DBC",
    name: "Gandhi DB Balance Churna",
    tagline: "A daily balance churna for modern lifestyles.",
    packSizes: "100g · 200g",
    intro: [
      "Modern routines tend to throw the body's natural rhythms off — irregular meals, long sit-down hours, sweet cravings at odd times. Gandhi DB Balance Churna is a polyherbal formulation built around this everyday reality, drawing on classical Ayurvedic dravyas traditionally associated with metabolic balance and digestive support.",
      "Most people take a small spoon with warm water before meals. Some prefer it before bed. It's been formulated to be easy to live with — not so bitter that taking it feels like a chore, not so mild that you wonder if it's working.",
    ],
    whatsInThePack:
      "Polyherbal blend including Karela, Jamun, Gudmar, Methi, Haldi and supporting Ayurvedic dravyas. Full composition list printed on the pack.",
    howToUse:
      "3 to 5 grams (about half to one teaspoon), once or twice a day, with warm water — ideally before meals. Or as advised by your Ayurvedic physician.",
    cautions:
      "If you're already on regular medication — particularly anything that affects blood sugar — please check with your physician before adding this to your routine. Pregnant or breastfeeding mothers should also consult before starting. Keep tightly closed in a cool dry place. Best used within the period printed on the pack.",
    classification: "Proprietary Blend — Metabolic Wellness",
    hsnCode: "30049011",
    gst: "12%",
  },

  DBT: {
    sku: "DBT",
    name: "Gandhi DB Balance Tablet",
    tagline: "The same formulation. In a tablet.",
    packSizes: "60 tablets · 120 tablets",
    intro: [
      "Loose powders aren't always practical — at the office, while travelling, or simply because the bitter notes of certain herbs aren't what you want first thing in the morning. Gandhi DB Balance Tablet is the same Ayurvedic formulation as our Churna, compressed into easy-to-swallow tablets.",
      "Two tablets, twice a day, with warm water. The tablet form makes consistency easier, which — with anything Ayurvedic — is usually the thing that matters most over time.",
    ],
    whatsInThePack:
      "Each 500 mg tablet contains the polyherbal Gandhi DB Balance formulation. Permitted Ayurvedic excipients used for tablet compression. Full composition on pack.",
    howToUse:
      "1 to 2 tablets, twice a day, with warm water — ideally before meals. Or as advised by your Ayurvedic physician.",
    cautions:
      "Same caution as our Churna form: if you're on regular medication for blood sugar, consult your physician before starting. Not for children under 14 unless advised by an Ayurvedic physician. Pregnant or breastfeeding mothers should consult first.",
    classification: "Proprietary Blend — Metabolic Wellness",
    hsnCode: "30049011",
    gst: "12%",
  },

  GHO: {
    sku: "GHO",
    name: "Gandhi Hair Oil",
    tagline: "An everyday Ayurvedic hair oil. Properly made.",
    packSizes: "100 ml · 200 ml",
    intro: [
      "There's a particular ritual most Indians grew up with — a slow head massage with warm oil, usually on a Sunday afternoon. Gandhi Hair Oil is made for that ritual. It's a Bhringraj-base hair oil cooked the slow way, in a sesame and coconut oil base, with the herbs simmered in until the oil takes on their character.",
      "It smells like a real Ayurvedic hair oil should — Bhringraj, Amla, Brahmi — not like synthetic perfume trying to mask cheaper oil. Apply to the scalp and length, leave it on for an hour or overnight, wash out with a mild cleanser. Old-fashioned in the best sense.",
    ],
    whatsInThePack:
      "Til (sesame) and Nariyal (coconut) oil base, slow-cooked with Bhringraj, Amla, Brahmi, Jatamansi and supporting Keshya herbs. Full ingredient list on pack.",
    howToUse:
      "Warm a small quantity in your palm. Massage into the scalp and through the length of the hair. Leave on for an hour, or overnight if you prefer. Wash out with a mild cleanser. Use 2–3 times a week, or as suits your routine.",
    cautions:
      "For external use only. If you have sensitive skin, do a small patch test on the inner arm first. Avoid contact with eyes. Keep out of children's reach. Store in a cool dry place away from sunlight.",
    classification: "Proprietary — Hair Care (External)",
    hsnCode: "30049011",
    gst: "12%",
  },

  GHR: {
    sku: "GHR",
    name: "Gandhi Hair Revitalising Powder",
    tagline: "A herbal hair-wash powder, the way grandmothers made it.",
    packSizes: "100g · 200g",
    intro: [
      "Long before sulphate shampoos arrived, Indian households washed hair with a powder — Shikakai, Reetha, Amla, hibiscus, fenugreek, all sun-dried and milled together. Gandhi Hair Revitalising Powder is exactly that recipe, made in small batches.",
      "Mix two tablespoons with warm water into a thin paste. Apply to wet hair and scalp, work it through, rinse thoroughly. It doesn't lather like detergent shampoos — that's the point. What it does is leave hair feeling clean and soft without the stripped feeling. The first few washes feel different; by the third, most people don't go back.",
    ],
    whatsInThePack:
      "Shikakai, Aritha (Reetha), Amla, Bhringraj, Methi, Japa flower, and supporting hair-care herbs — sun-dried and finely milled. Full ingredient list on pack.",
    howToUse:
      "Mix 2 tablespoons of the powder with warm water into a thin paste. Apply to wet hair and scalp, massage gently, leave for a few minutes, rinse thoroughly. Use 2–3 times a week.",
    cautions:
      "For external use only. Avoid contact with eyes — if it gets in, rinse with plenty of cool water. Patch test before first use if you have sensitive skin. Keep dry between uses; store tightly closed in a cool, dry place.",
    classification: "Proprietary — Hair Care (External)",
    hsnCode: "33059040",
    gst: "18%",
  },

  GHS: {
    sku: "GHS",
    name: "Gandhi Hair Shampoo",
    tagline: "A liquid Ayurvedic shampoo, for those who prefer the convenience.",
    packSizes: "100 ml · 200 ml",
    intro: [
      "Not everyone has the time to mix a powder shampoo every wash. Gandhi Hair Shampoo is our liquid Ayurvedic version — formulated around the same Shikakai-Reetha-Amla base as our powder, with a mild plant-derived cleansing system that lathers gently and rinses clean.",
      "No silicones, no parabens, no harsh sulphates. A small amount worked through wet hair is all you need. The fragrance is the herbs themselves, not a perfumer's approximation of what 'herbal' should smell like.",
    ],
    whatsInThePack:
      "Aqueous extracts of Shikakai, Aritha, Amla, Bhringraj, Brahmi, with mild plant-derived cleansing agents. Free from parabens, silicones and harsh sulphates. Full ingredient list on pack.",
    howToUse:
      "Wet hair thoroughly. Take a small amount in the palm, work into a lather, massage into scalp and hair. Rinse with plenty of water. Use as often as you wash your hair.",
    cautions:
      "For external use only. Avoid contact with eyes — if it gets in, rinse with plenty of cool water. Discontinue use if any irritation occurs. Store in a cool dry place with the bottle tightly closed.",
    classification: "Proprietary — Hair Care (External)",
    hsnCode: "33051090",
    gst: "18%",
  },

  KOP: {
    sku: "KOP",
    name: "Gandhi Kofmukta Churna",
    tagline: "A traditional Ayurvedic churna for everyday throat comfort.",
    packSizes: "50g · 100g",
    intro: [
      "Throat scratchiness, the dry tickle that arrives with a change in season, the feeling of needing to clear your throat too often — small inconveniences most people have grown up handling with kitchen Ayurveda. Gandhi Kofmukta Churna is built around that tradition: a polyherbal blend of Mulethi, Sitopaladi, Vasa and supporting throat-soothing herbs.",
      "A pinch on the tongue with a teaspoon of honey, two or three times a day. Or stirred into warm water. Many families keep a small jar in the kitchen and bring it out when the seasons turn.",
    ],
    whatsInThePack:
      "Mulethi (Yashtimadhu), Sitopaladi base, Vasa, Tulsi, Pippali, Sunth and supporting Ayurvedic herbs. Full composition on pack.",
    howToUse:
      "1 to 3 grams (¼ to ½ teaspoon), 2–3 times a day, with honey or warm water. Or as advised by your Ayurvedic physician.",
    cautions:
      "Not recommended for children under 5. If symptoms persist beyond a few days, consult your Ayurvedic physician. Pregnant or breastfeeding mothers should consult before starting. Store tightly closed in a cool dry place.",
    classification: "Proprietary — Respiratory",
    hsnCode: "30049011",
    gst: "12%",
  },

  KOT: {
    sku: "KOT",
    name: "Gandhi Kofmukta Tablet",
    tagline: "Same formulation. Easier to carry.",
    packSizes: "60 tablets · 120 tablets",
    intro: [
      "If you prefer a tablet to a powder — or you want to keep something in your bag without worrying about spillage — Gandhi Kofmukta Tablet is the same throat-soothing Ayurvedic formulation as our Churna, compressed into 510 mg tablets.",
      "One or two tablets, slowly chewed or allowed to dissolve in the mouth, two to three times a day. The slow-dissolve approach lets the herbs work in the throat itself.",
    ],
    whatsInThePack:
      "Each 510 mg tablet contains the Gandhi Kofmukta polyherbal formulation. Permitted Ayurvedic excipients used for tablet compression. Full composition on pack.",
    howToUse:
      "1 to 2 tablets, slowly chewed or allowed to dissolve in the mouth, 2–3 times a day. Or as advised by your Ayurvedic physician.",
    cautions:
      "Not recommended for children under 8. If discomfort persists, consult your physician. Pregnant or breastfeeding mothers should consult first. Store tightly closed in a cool dry place.",
    classification: "Proprietary — Respiratory",
    hsnCode: "30049011",
    gst: "12%",
  },

  MFP: {
    sku: "MFP",
    name: "Gandhi Mix Faki Churna",
    tagline: "An after-meal digestive churna, on the table when you need it.",
    packSizes: "50g · 100g",
    intro: [
      "A heavy meal, a bloated feeling, the slight discomfort that lingers an hour after eating — most Indian families have always kept something on the table for exactly this. Gandhi Mix Faki Churna is our take on that tradition: a blend of Ajmoda, Saunf, Hing, Sendha namak, Sunth and other classical digestive dravyas, milled fine and ready to take straight off the spoon.",
      "A small pinch after lunch and dinner. Or stirred into warm water. The flavour is sharp and savoury — distinctly Ayurvedic, distinctly Gujarati.",
    ],
    whatsInThePack:
      "Ajmoda, Saunf, Hing, Sendha namak, Sunth, Pippali, Maricha, Jeera and supporting digestive herbs. Full composition on pack.",
    howToUse:
      "1 to 3 grams (¼ to ½ teaspoon), after meals, taken straight off the spoon or with warm water. Use as needed.",
    cautions:
      "Contains Sendha namak — those on a strict low-sodium diet should consult their physician. Pregnant or breastfeeding mothers should consult before starting. Not for children under 8. Store tightly closed in a cool dry place.",
    classification: "Proprietary — Digestive (Saurashtrian household formula)",
    hsnCode: "30049011",
    gst: "12%",
  },

  MFT: {
    sku: "MFT",
    name: "Gandhi Mix Faki Tablet",
    tagline: "Same digestive churna. Tablet form.",
    packSizes: "60 tablets · 120 tablets",
    intro: [
      "The same after-meal Ayurvedic blend as our Mix Faki Churna, compressed into 510 mg tablets that are easier to carry and easier to take when you're out. Slip the bottle in your bag and you have it after lunch on a workday, after dinner at a restaurant, or after a heavy festival meal.",
      "One or two tablets after meals, with warm water. Same formulation, same effect, more convenient form.",
    ],
    whatsInThePack:
      "Each 510 mg tablet contains the Gandhi Mix Faki digestive formulation. Permitted Ayurvedic excipients used for tablet compression. Full composition on pack.",
    howToUse:
      "1 to 2 tablets after meals, with warm water. Use as needed, up to 3 times a day.",
    cautions:
      "Contains Sendha namak — those on a strict low-sodium diet should consult their physician. Pregnant or breastfeeding mothers should consult first. Not for children under 8. Store tightly closed in a cool dry place.",
    classification: "Proprietary — Digestive",
    hsnCode: "30049011",
    gst: "12%",
  },

  GSP: {
    sku: "GSP",
    name: "Gandhi Sishuraksha Powder",
    tagline: "A gentle traditional churna for the little ones.",
    packSizes: "50g · 100g",
    intro: [
      "Generations of Indian mothers have kept a small jar of a gentle churna for their children — a pinch in honey for fussiness, after a heavy meal, or as part of the evening routine. Gandhi Sishuraksha Powder follows that tradition: very mild, carefully blended, made with classical herbs that have been used in Indian households for children for centuries.",
      "A very small pinch, mixed into honey, given as part of the evening routine. Always under the guidance of your paediatrician or Ayurvedic physician — anything you give a child should pass through them first.",
    ],
    whatsInThePack:
      "Mild blend of classical paediatric Ayurvedic herbs including Vidanga, Saunf, Mulethi, and supporting dravyas. Full composition on pack.",
    howToUse:
      "A very small pinch (approximately 250–500 mg), mixed in honey or breast milk, once or twice a day for children. Always under the guidance of your paediatrician or Ayurvedic physician.",
    cautions:
      "For children: please consult your paediatrician or registered Ayurvedic physician before starting any product, including this one. Not recommended for infants under 6 months. Keep out of reach of children. Store tightly closed in a cool dry place.",
    classification: "Proprietary — Paediatric (Bala)",
    hsnCode: "30049011",
    gst: "12%",
  },

  EHT: {
    sku: "EHT",
    name: "Erandbhrasht Haritaki Tablet",
    tagline: "Haritaki, gentled by the classical Erandbhrashtana process.",
    packSizes: "60 tablets · 120 tablets",
    intro: [
      "Erandbhrashtana is a classical Ayurvedic processing step — Haritaki fruit roasted with castor oil before being formulated into tablets. The process gentles the herb's stronger qualities while preserving what makes it useful: a daily Ayurvedic support for keeping things moving naturally.",
      "One or two tablets at bedtime, with warm water. The next morning takes care of itself, the way it's supposed to.",
    ],
    whatsInThePack:
      "Each 520 mg tablet: Haritaki (Terminalia chebula) processed by Erandbhrashtana with Eranda Taila, with permitted Ayurvedic excipients. Full composition on pack.",
    howToUse:
      "1 to 2 tablets at bedtime, with warm water. Or as advised by your Ayurvedic physician.",
    cautions:
      "Not recommended during the first trimester of pregnancy. Avoid during active loose motions. Not for children under 12. If you're on regular medication, consult your physician before starting. Store tightly closed in a cool dry place.",
    classification: "Proprietary — Vatanulomana / Anaha",
    hsnCode: "30049011",
    gst: "12%",
  },

  GLM: {
    sku: "GLM",
    name: "Gulabi Malham",
    tagline: "A traditional Ayurvedic balm for everyday topical comfort.",
    packSizes: "25g · 50g",
    intro: [
      "Gulabi Malham is the kind of thing that sat on most Indian family shelves for decades — a herbal topical balm reached for when something needed a soothing rub. Ours is made with Rose, Chandan, Yashtimadhu and supporting cooling herbs, in a ghee-and-beeswax base.",
      "A small dab on the area, gently rubbed in. The fragrance is the rose itself — soft, real, not synthetic.",
    ],
    whatsInThePack:
      "Rose (Gulab) extract, Chandan, Yashtimadhu, supporting cooling herbs, in a base of ghee and beeswax. Full ingredient list on pack.",
    howToUse:
      "Apply a small quantity to the area, gently massage in. Use as needed, 2–3 times a day. For external use only.",
    cautions:
      "For external use only. Patch test before first use if you have sensitive skin. Avoid contact with eyes and broken skin. Keep out of children's reach. Store in a cool dry place; if separation occurs in heat, gently warm and stir before use.",
    classification: "Proprietary — Topical (External)",
    hsnCode: "30049011",
    gst: "12%",
  },

  // ========================================================================
  // SECTION B — CLASSICAL COMPOUND FORMULATIONS (15 products)
  // ========================================================================

  AJC: {
    sku: "AJC",
    name: "Ajmodadi Churna",
    tagline: "A classical Ayurvedic blend for routine digestive care.",
    packSizes: "50g · 100g",
    intro: [
      "Ajmodadi Churna is one of those Ayurvedic formulations that has stayed on family shelves for centuries — a polyherbal blend with Ajmoda at its centre, supported by Vidanga, Saindhava and other warming digestive dravyas. It's been a household name in Indian Ayurveda long before either of us were born.",
      "A small spoon with warm water. That's the whole ritual.",
    ],
    whatsInThePack:
      "Classical Ajmodadi formulation: Ajmoda, Vidanga, Saindhava lavana, Pippalimula, Devadaru, Vacha, Chitraka and supporting Ayurvedic dravyas as per Sharangadhara Madhyama Khanda. Full composition on pack.",
    howToUse:
      "3 to 6 grams (½ to 1 teaspoon) with warm water, twice a day after meals. Or as advised by your Ayurvedic physician.",
    cautions:
      "Contains Saindhava lavana — those on a strict low-sodium diet should consult their physician. Pregnant or breastfeeding mothers should consult before starting. Store tightly closed in a cool dry place.",
    classification: "Classical Compound — Vatanulomana",
    hsnCode: "30049011",
    gst: "12%",
  },

  AVC: {
    sku: "AVC",
    name: "Avipattikar Churna",
    tagline: "Avipattikar Churna, made the classical way.",
    packSizes: "50g · 100g",
    intro: [
      "Avipattikar is one of the most well-known classical Ayurvedic churnas in India — the formulation dates back to Sharangadhara Samhita and has been a household name for centuries for its role in routine digestive comfort.",
      "We make it the way it was meant to be made — full classical proportions, no shortcuts. A spoon with cool or warm water, taken when you need it.",
    ],
    whatsInThePack:
      "Classical Avipattikar formulation as per Sharangadhara Samhita: Trivrit, Lavanga, Maricha, Pippali, Ela, Tejpatra, Sunth, Mustaka, Triphala and supporting dravyas. Full composition on pack.",
    howToUse:
      "3 to 6 grams (½ to 1 teaspoon) with warm or cool water, once or twice a day. Or as advised by your Ayurvedic physician.",
    cautions:
      "Contains Trivrit — not recommended during pregnancy. Pregnant or breastfeeding mothers should consult their physician. Not for children under 12 unless advised. Store tightly closed in a cool dry place.",
    classification: "Classical Compound — Pittahara",
    hsnCode: "30049011",
    gst: "12%",
  },

  HVC: {
    sku: "HVC",
    name: "Hingvashtaka Churna",
    tagline: "Hingvashtaka — the eight-herb digestive classic.",
    packSizes: "50g · 100g",
    intro: [
      "Hingvashtaka literally means 'Hing plus eight' — Hing (asafoetida) supported by eight other warming, digestive dravyas. It's one of those Ayurvedic preparations that nearly every Indian kitchen has had a small box of, somewhere near the spice rack.",
      "Mix a small spoon into the first morsel of food at the beginning of a meal, with a drizzle of ghee. That's how it was traditionally taken, and it's still how we'd recommend it.",
    ],
    whatsInThePack:
      "Classical Hingvashtaka formulation: Hing, Sunth, Maricha, Pippali, Ajmoda, Jeera (white and black), Saindhava lavana. Full composition on pack.",
    howToUse:
      "2 to 4 grams (½ teaspoon) mixed with the first morsel of food at the start of meals, with a small amount of ghee. Or as advised by your Ayurvedic physician.",
    cautions:
      "Contains Saindhava lavana — those on a strict low-sodium diet should consult. Pregnant or breastfeeding mothers should consult first. Store tightly closed in a cool dry place.",
    classification: "Classical Compound — Deepan-Pachan",
    hsnCode: "30049011",
    gst: "12%",
  },

  RSC: {
    sku: "RSC",
    name: "Rasayan Churna",
    tagline: "Rasayan Churna — the classical wellness blend.",
    packSizes: "100g · 200g",
    intro: [
      "Rasayana is the Ayurvedic word for things that nourish, sustain, and renew — and Rasayan Churna is the classical preparation that brings together a small group of these herbs into a single daily-use blend. The formulation is built around Ashwagandha, Gokshura and Shatavari — three of Ayurveda's most well-known Rasayana dravyas.",
      "A small spoon with warm milk, ideally at night. A daily ritual rather than a medicine, the way Rasayana has always been understood.",
    ],
    whatsInThePack:
      "Classical Rasayan formulation: Ashwagandha, Gokshura, Shatavari in classical proportion. Full composition on pack.",
    howToUse:
      "3 to 6 grams (½ to 1 teaspoon) with warm milk, once a day, ideally at night. Or as advised by your Ayurvedic physician.",
    cautions:
      "Pregnant or breastfeeding mothers should consult before starting. If you're on hormone therapy or have a medical condition affecting the thyroid, consult your physician. Store tightly closed in a cool dry place.",
    classification: "Classical Compound — Rasayana",
    hsnCode: "30049011",
    gst: "12%",
  },

  SPC: {
    sku: "SPC",
    name: "Shivakshar Pachan Churna",
    tagline: "Shivakshar Pachan Churna — for everyday digestion.",
    packSizes: "50g · 100g",
    intro: [
      "Shivakshar Pachan Churna is the Ayurvedic answer to that uncomfortable feeling after a heavy meal — the bloating, the slow-moving feeling, the sense that lunch is still sitting with you at four in the afternoon. The formulation is built around classical Ayurvedic salts and warming digestive herbs.",
      "A small spoon with warm water, taken when you need it. Sharp and savoury — exactly what an Ayurvedic Pachan churna should taste like.",
    ],
    whatsInThePack:
      "Classical Shivakshar Pachan formulation: Yavakshara, Sarjikakshara, Saindhava, Sunth, Pippali, Maricha, Hing and supporting digestive dravyas. Full composition on pack.",
    howToUse:
      "2 to 4 grams (½ teaspoon) with warm water, after meals. Use as needed.",
    cautions:
      "Contains classical kshara salts and Saindhava lavana — those on a strict low-sodium diet, or with acid reflux, should consult their physician. Pregnant or breastfeeding mothers should consult first. Store tightly closed in a cool dry place.",
    classification: "Classical Compound — Deepan-Pachan",
    hsnCode: "30049011",
    gst: "12%",
  },

  STC: {
    sku: "STC",
    name: "Sitopaladi Churna",
    tagline: "Sitopaladi — the classical Ayurvedic comfort churna.",
    packSizes: "50g · 100g",
    intro: [
      "Sitopaladi is one of the most universally recognised classical Ayurvedic formulations in India — the kind of thing households keep through the colder months or when seasons change. Built around Mishri, Vamshalochana, Pippali, Ela and Twak, the texture is finer than most churnas and the flavour mildly sweet.",
      "A pinch on the tongue with honey, two or three times a day. Children take to it more readily than they do most Ayurvedic preparations.",
    ],
    whatsInThePack:
      "Classical Sitopaladi formulation: Mishri (Sitopala), Vamshalochana, Pippali, Ela, Twak in classical proportion. Full composition on pack.",
    howToUse:
      "1 to 3 grams (¼ to ½ teaspoon), 2–3 times a day, with honey or warm water. Or as advised by your Ayurvedic physician.",
    cautions:
      "Contains Mishri (sugar) — those managing sugar intake should account for this. If symptoms persist beyond a few days, consult your physician. For children, use under guidance from your paediatrician or Ayurvedic physician. Store tightly closed in a cool dry place.",
    classification: "Classical Compound — Kasa-Shwasa",
    hsnCode: "30049011",
    gst: "12%",
  },

  SDC: {
    sku: "SDC",
    name: "Sudarshan Churna",
    tagline: "Sudarshan Churna — the classical seasonal blend.",
    packSizes: "50g · 100g",
    intro: [
      "Sudarshan Churna takes its name from the Sanskrit word meaning 'auspicious to behold' — and the formulation has been a household staple in Indian Ayurveda for as long as anyone can remember. Built around Kiratatikta (Chirayata) with over fifty supporting classical dravyas, the taste is unmistakably bitter.",
      "A small spoon with warm water, twice a day during seasonal changes — the way most families have always used it.",
    ],
    whatsInThePack:
      "Classical Sudarshan formulation: Kiratatikta principal, with classical supporting dravyas as per Bhaishajya Ratnavali. Full composition on pack.",
    howToUse:
      "2 to 4 grams (½ teaspoon) with warm water, twice a day. Or as advised by your Ayurvedic physician.",
    cautions:
      "Pregnant or breastfeeding mothers should consult before starting. Not for children under 12 unless advised. The bitter taste is characteristic of the formulation. Store tightly closed in a cool dry place.",
    classification: "Classical Compound — Jwarahara",
    hsnCode: "30049011",
    gst: "12%",
  },

  SDT: {
    sku: "SDT",
    name: "Sudarshan Tablet",
    tagline: "The bitter classical, in a tablet you can swallow.",
    packSizes: "60 tablets · 120 tablets",
    intro: [
      "Sudarshan Churna is famously bitter — that's the herbs doing what they do. For those who'd rather not taste it directly, the same formulation in tablet form is the answer. Two tablets twice a day, swallowed with warm water, and the formulation still does what it has always done.",
    ],
    whatsInThePack:
      "Each 550 mg tablet contains the classical Sudarshan formulation. Permitted Ayurvedic excipients used for tablet compression. Full composition on pack.",
    howToUse:
      "1 to 2 tablets, twice a day, with warm water. Or as advised by your Ayurvedic physician.",
    cautions:
      "Pregnant or breastfeeding mothers should consult first. Not for children under 12 unless advised by an Ayurvedic physician. Store tightly closed in a cool dry place.",
    classification: "Classical Compound — Jwarahara",
    hsnCode: "30049011",
    gst: "12%",
  },

  TRC: {
    sku: "TRC",
    name: "Triphala Churna",
    tagline: "Triphala — three fruits, milled clean, classical proportion.",
    packSizes: "100g · 200g",
    intro: [
      "Triphala needs no introduction — three fruits (Haritaki, Bibhitaki, Amalaki) in classical equal proportion, milled into a single fine powder. It's possibly the single most-used Ayurvedic preparation in Indian households, and there's a reason it's stayed there for centuries.",
      "A spoon with warm water at night. Some prefer it first thing in the morning. There's no single right way — you settle into your own routine.",
    ],
    whatsInThePack:
      "Classical Triphala in equal parts: Haritaki, Bibhitaki, Amalaki — deseeded fruit pulp, sun-dried, fine-milled. Full composition on pack.",
    howToUse:
      "3 to 6 grams (½ to 1 teaspoon) with warm water, once a day — at night or first thing in the morning. Or as advised by your Ayurvedic physician.",
    cautions:
      "Pregnant or breastfeeding mothers should consult before starting. Not for children under 8 unless advised. Store tightly closed in a cool dry place.",
    classification: "Classical Compound — Tridoshahara Rasayana",
    hsnCode: "30049011",
    gst: "12%",
  },

  TRT: {
    sku: "TRT",
    name: "Triphala Tablet",
    tagline: "Triphala, in tablets.",
    packSizes: "60 tablets · 120 tablets",
    intro: [
      "The same Triphala, the same classical equal proportions, just compressed into tablets for those who'd rather not deal with the powder. Two tablets at night with warm water — a small ritual, easy to keep.",
    ],
    whatsInThePack:
      "Each 500 mg tablet contains classical Triphala in equal parts (Haritaki, Bibhitaki, Amalaki). Permitted Ayurvedic excipients used for tablet compression. Full composition on pack.",
    howToUse:
      "1 to 2 tablets at night, with warm water. Or as advised by your Ayurvedic physician.",
    cautions:
      "Pregnant or breastfeeding mothers should consult first. Not for children under 8 unless advised. Store tightly closed in a cool dry place.",
    classification: "Classical Compound — Tridoshahara Rasayana",
    hsnCode: "30049011",
    gst: "12%",
  },

  GUT: {
    sku: "GUT",
    name: "Gunja Taila",
    tagline: "Gunja Taila — a classical external Ayurvedic oil.",
    packSizes: "50 ml · 100 ml",
    intro: [
      "Gunja Taila is a classical Ayurvedic external preparation — a hair oil cooked with the seed of Abrus precatorius, properly Shodhita (purified) before processing per classical procedure. Used in the Indian Keshya tradition for generations as part of long, slow head-massage routines.",
      "External use only — apply to the scalp, leave for an hour or two, wash out with a mild cleanser.",
    ],
    whatsInThePack:
      "Classical Gunja Taila: Shodhita Gunja seed processed in a sesame oil base per classical method. Full composition on pack.",
    howToUse:
      "External application only. Massage a small quantity into the scalp, leave for 1–2 hours, wash out with a mild cleanser. Use 2–3 times a week.",
    cautions:
      "FOR EXTERNAL USE ONLY. Never to be taken internally. Keep strictly out of children's reach. Patch test before first use. Avoid contact with eyes, broken skin, and mucous membranes. If irritation occurs, discontinue use. Store tightly closed away from children.",
    classification: "Classical Compound — External Taila",
    hsnCode: "30049011",
    gst: "12%",
  },

  KRT: {
    sku: "KRT",
    name: "Karanj Taila",
    tagline: "Karanj Taila — a classical external oil for skin care.",
    packSizes: "50 ml · 100 ml",
    intro: [
      "Karanj Taila is the classical Ayurvedic preparation pressed from Pongamia pinnata seeds — a thick, naturally pungent oil used in traditional Indian external skin and scalp care for centuries.",
      "A small quantity, applied externally to the area as needed. The oil has a characteristic smell — strong, herbal, unmistakable.",
    ],
    whatsInThePack:
      "Cold-pressed Karanja (Pongamia pinnata) seed oil, classical preparation. Full composition on pack.",
    howToUse:
      "External application only. Apply a small quantity to the area as needed, 1–2 times a day. Massage gently.",
    cautions:
      "FOR EXTERNAL USE ONLY. Patch test before first use. Avoid contact with eyes, broken skin, and mucous membranes. Discontinue use if irritation occurs. Keep out of children's reach. Store in a cool dry place.",
    classification: "Classical Compound — External Taila",
    hsnCode: "30049011",
    gst: "12%",
  },

  KLT: {
    sku: "KLT",
    name: "Kalonji Taila",
    tagline: "Kalonji Taila — pure cold-pressed black seed oil.",
    packSizes: "50 ml · 100 ml",
    intro: [
      "Kalonji — Nigella sativa — has been part of Indian and West Asian household traditions for centuries, both in cooking and in topical use. Our Kalonji Taila is cold-pressed from black seeds, single-source, lightly filtered, bottled simply.",
      "External application as needed, or used in small quantities in food per traditional cuisine.",
    ],
    whatsInThePack:
      "Cold-pressed Kalonji (Nigella sativa) black seed oil. Single ingredient, no additions. Full details on pack.",
    howToUse:
      "External: a few drops massaged into the area as needed. For culinary use as per traditional practice. Or as advised by your Ayurvedic physician.",
    cautions:
      "Patch test before first external use. If pregnant, breastfeeding, or on regular medication, consult your physician before significant culinary use. Keep out of children's reach. Store in a cool dry place away from sunlight.",
    classification: "Classical Compound — Taila",
    hsnCode: "30049011",
    gst: "12%",
  },

  NIT: {
    sku: "NIT",
    name: "Neem Taila",
    tagline: "Neem Taila — pure cold-pressed neem oil.",
    packSizes: "50 ml · 100 ml",
    intro: [
      "Neem oil's place in Indian household tradition needs no introduction — the seed oil has been used in topical skin and scalp care, in textile and storage care, and in the Indian garden for as long as anyone has kept records. Ours is cold-pressed, single-source, lightly filtered.",
      "External use, applied to the area as needed. Strong neem smell — that's the way real neem oil smells.",
    ],
    whatsInThePack:
      "Cold-pressed Neem (Azadirachta indica) seed oil. Single ingredient, no additions. Full details on pack.",
    howToUse:
      "External application only. Apply a small quantity to the area as needed, 1–2 times a day. Massage gently.",
    cautions:
      "FOR EXTERNAL USE ONLY. Patch test before first use. Avoid contact with eyes, broken skin, and mucous membranes. Pregnant women should avoid use. Keep out of children's reach. Store in a cool dry place.",
    classification: "Classical Compound — External Taila",
    hsnCode: "30049011",
    gst: "12%",
  },

  BTT: {
    sku: "BTT",
    name: "Black Tila Taila",
    tagline: "Black sesame oil — cold-pressed, single-source.",
    packSizes: "100 ml · 200 ml",
    intro: [
      "Black sesame is the variety classical Ayurveda has always considered superior for Sneha use — a slightly heavier, slightly richer oil than its white counterpart. Our Black Tila Taila is cold-pressed from a single batch of black sesame, lightly filtered, bottled in dark glass.",
      "Suitable as a base for classical Sneha Kalpana (Murchhana, Anu Taila), for daily Abhyanga, for Gandusha (oil pulling), or for high-quality culinary use.",
    ],
    whatsInThePack:
      "Cold-pressed black sesame (Krishna Tila, Sesamum indicum) seed oil. Single-source, no additions. Full details on pack.",
    howToUse:
      "External (Abhyanga, Gandusha, base for classical Tailas): use as required. Culinary: use as per traditional practice. Or as advised by your Ayurvedic physician.",
    cautions:
      "Sesame allergy — avoid. Patch test before first external use if you have sensitive skin. Keep out of children's reach. Store in a cool dry place away from sunlight.",
    classification: "Classical Compound — Base Taila",
    hsnCode: "30049011",
    gst: "12%",
  },

  // ========================================================================
  // SECTION C — SINGLE-HERB, EXTERNAL & BASE TAILAS (31 products)
  // ========================================================================

  AMC: {
    sku: "AMC",
    name: "Amalaki Churna",
    tagline: "Pure Indian Gooseberry powder. Single-herb, fine-milled.",
    packSizes: "100g · 200g",
    intro: [
      "Amalaki — the Indian Gooseberry — is one of those Ayurvedic essentials that almost every Indian household has heard of, even if they haven't kept a jar of it. We make ours the straightforward way: clean fruit, dried slowly, milled fine, packed. No fillers, no flow agents, no added colour.",
      "Most people take half a teaspoon to a teaspoon in the morning, mixed into warm water or stirred into a little honey. Some prefer it with warm milk before bed.",
    ],
    whatsInThePack: "100% Amalaki (Phyllanthus emblica) dried fruit powder. Single ingredient.",
    howToUse:
      "3 to 6 grams (½ to 1 teaspoon), once or twice a day, with warm water, honey, or warm milk.",
    cautions:
      "If pregnant, breastfeeding, or on regular medication, consult your Ayurvedic physician. Keep tightly closed in a cool dry place. Best used within the period printed on the pack.",
    classification: "Single-herb Churna — Rasayana",
    hsnCode: "30049011",
    gst: "12%",
  },

  AHC: {
    sku: "AHC",
    name: "Amba Haldar Churna",
    tagline: "Amba Haldar — the mango-scented turmeric.",
    packSizes: "100g · 200g",
    intro: [
      "Amba Haldar is mango ginger — Curcuma amada — a relative of the common turmeric with a distinctive raw-mango aroma when you open the jar. Used in Indian household Ayurveda for inflammation and digestion, and externally as a Lepa.",
      "Less talked about than common turmeric, but those who know it tend to keep a jar.",
    ],
    whatsInThePack: "100% Amba Haldar (Curcuma amada) dried rhizome powder. Single ingredient.",
    howToUse:
      "1 to 3 grams (¼ to ½ teaspoon), once or twice a day, with warm water, milk, or honey. Or as advised by your Ayurvedic physician.",
    cautions:
      "Pregnant women should consult before use. Those on blood-thinning medication should consult their physician. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Internal",
    hsnCode: "30049011",
    gst: "12%",
  },

  ARC: {
    sku: "ARC",
    name: "Arjuna Churna",
    tagline: "Arjuna inner-bark powder, the way Vagbhata recommended.",
    packSizes: "100g · 200g",
    intro: [
      "Arjuna bark has been called the heart's friend in classical Ayurveda since Ashtanga Hridaya, and the recommended classical preparation is straightforward: a spoon of the powder boiled in equal parts milk and water until only the milk remains. That's Ksheerapaka — and that's how Arjuna has been taken in Indian households for centuries.",
      "We use only the inner bark — the rough outer layer is stripped before drying.",
    ],
    whatsInThePack: "100% Arjuna (Terminalia arjuna) inner bark powder. Single ingredient.",
    howToUse:
      "Classical Ksheerapaka: 1 teaspoon (~5 g) boiled in 200 ml milk + 200 ml water until only the milk remains. Once or twice a day. Or 3–6 g with warm water.",
    cautions:
      "If you have a heart condition or are on cardiac medication, please coordinate with your treating physician before starting. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Hridya",
    hsnCode: "30049011",
    gst: "12%",
  },

  AWC: {
    sku: "AWC",
    name: "Ashwagandha Churna",
    tagline: "Pure Ashwagandha root powder. Just the root.",
    packSizes: "100g · 200g",
    intro: [
      "Ashwagandha is one of the most universally recognised Ayurvedic herbs, and one of the most adulterated in the market. The cheap stuff blends in aerial parts to extend volume; we use root only. Open the jar and the characteristic horse-like smell that gives Ashwagandha its name is unmistakable — that's the field check.",
      "A spoon with warm milk, ideally at night.",
    ],
    whatsInThePack:
      "100% Ashwagandha (Withania somnifera) root powder. Root only — no aerial parts. Single ingredient.",
    howToUse:
      "3 to 6 grams (½ to 1 teaspoon), once or twice a day, with warm milk, water, ghee, or honey.",
    cautions:
      "Pregnant or breastfeeding mothers should consult before starting. If you have a thyroid condition or are on hormone therapy, consult your physician. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Rasayana / Balya",
    hsnCode: "30049011",
    gst: "12%",
  },

  BHC: {
    sku: "BHC",
    name: "Baheda Churna",
    tagline: "Bibhitaki / Baheda — the Kapha leg of Triphala, on its own.",
    packSizes: "100g · 200g",
    intro: [
      "Bibhitaki anchors the Kapha-pacifying side of Triphala but holds its own as a single-herb preparation. Indian households have used it on its own for as long as they've used the trio, particularly through colder months. Deseeded fruit pulp, sun-dried, milled fine.",
    ],
    whatsInThePack:
      "100% Bibhitaki (Terminalia bellirica) deseeded fruit pulp powder. Single ingredient.",
    howToUse:
      "3 to 6 grams (½ to 1 teaspoon), once or twice a day, with honey or warm water. Useful as a gargle base — ½ teaspoon in 100 ml warm water.",
    cautions:
      "Pregnant or breastfeeding mothers should consult before starting. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Kasa-Shwasa",
    hsnCode: "30049011",
    gst: "12%",
  },

  BPC: {
    sku: "BPC",
    name: "Baval Paida Churna",
    tagline: "Babbula — the classical astringent, gum and bark together.",
    packSizes: "100g · 200g",
    intro: [
      "Babbula — known locally as Baval — is one of the most concentrated astringent (Kashaya) dravyas in classical Ayurvedic materia medica. Both the gum and the inner bark are used, and our churna combines both. Used in Indian household tradition for routine oral care, gargles, and external dusting.",
    ],
    whatsInThePack: "Babbula (Acacia nilotica) gum and inner bark, combined and milled. Single-source preparation.",
    howToUse:
      "1 to 3 grams (¼ to ½ teaspoon), 2–3 times a day with buttermilk, rice water, or warm water. As gargle: ½ teaspoon in 100 ml warm water.",
    cautions:
      "Avoid if you have constipation. Pregnant or breastfeeding mothers should consult before use. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Sthambhana",
    hsnCode: "30049011",
    gst: "12%",
  },

  BRC: {
    sku: "BRC",
    name: "Bhringraj Churna",
    tagline: "Bhringraj — whole-plant powder, classically prepared.",
    packSizes: "100g · 200g",
    intro: [
      "Bhringaraj has been called Kesharaja — the king of hair — in classical Indian Ayurveda, but its quieter reputation in Indian households is as a hair-and-liver support herb. We use the whole plant, harvested at flowering when the herb is at its richest, then shade-dried and milled.",
      "Internally with honey or water; externally as a Lepa for the scalp.",
    ],
    whatsInThePack: "100% Bhringaraj (Eclipta alba) whole-plant powder. Single ingredient.",
    howToUse:
      "Internal: 3 to 6 grams (½ to 1 teaspoon), once or twice a day with honey or water. External: mix with water or oil into a paste for scalp application.",
    cautions:
      "Pregnant or breastfeeding mothers should consult before starting. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Keshya / Yakrut",
    hsnCode: "30049011",
    gst: "12%",
  },

  BMC: {
    sku: "BMC",
    name: "Brahmi Churna",
    tagline: "Brahmi — pure Bacopa monnieri, whole-plant powder.",
    packSizes: "100g · 200g",
    intro: [
      "Brahmi sits at the top of Charaka's classical list of intellect-promoting herbs, and it's stayed in that position for over two millennia. We use the actual Bacopa monnieri — not the substituted Mandukparni (Centella asiatica), which is a different herb entirely sold under the same name.",
      "A spoon with ghee, or with honey or warm milk. The classical anupana for Brahmi has always been ghee.",
    ],
    whatsInThePack:
      "100% Brahmi (Bacopa monnieri) whole-plant powder. Verified species. Single ingredient.",
    howToUse:
      "3 to 6 grams (½ to 1 teaspoon), once or twice a day with ghee, milk, honey, or water.",
    cautions:
      "Pregnant or breastfeeding mothers should consult before starting. If you have a slow heart rate or are on cardiac medication, consult your physician. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Medhya",
    hsnCode: "30049011",
    gst: "12%",
  },

  CRC: {
    sku: "CRC",
    name: "Chirayata Churna",
    tagline: "Chirayata — the bitterest herb in the cabinet.",
    packSizes: "100g · 200g",
    intro: [
      "Kiratatikta — Chirayata — is famously bitter, and that bitterness is what does the work. The herb anchors classical Sudarshan Churna, and used on its own it has been a staple in Indian Ayurveda for seasonal support and routine wellness. We use authentic Swertia chirata, not the cheaper Indian-plain substitute.",
      "The bitterness needs honey to be tolerable — and that's exactly how classical texts recommend taking it.",
    ],
    whatsInThePack:
      "100% Chirayata / Kiratatikta (Swertia chirata) whole-plant powder. Authentic species.",
    howToUse:
      "1 to 3 grams (¼ to ½ teaspoon), twice a day with honey or warm water.",
    cautions:
      "Pregnant women should avoid. The bitter taste is intrinsic to the herb. If you feel weak or fatigued, reduce frequency. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Jwarahara / Tikta",
    hsnCode: "30049011",
    gst: "12%",
  },

  GLC: {
    sku: "GLC",
    name: "Galo Churna",
    tagline: "Guduchi — the herb classical texts called Amrita.",
    packSizes: "100g · 200g",
    intro: [
      "Guduchi — locally Galo — earns its classical name Amrita (the nectar of immortality) through reliability rather than hyperbole. Used in Indian Ayurvedic households for seasonal support, routine wellness, and as a Rasayana. We use mature stem, fresh-cut and rapidly dried — the alkaloids degrade fast in slow drying, and most market Guduchi sits too long before processing.",
    ],
    whatsInThePack:
      "100% Guduchi / Galo (Tinospora cordifolia) mature stem powder. Single ingredient.",
    howToUse:
      "3 to 6 grams (½ to 1 teaspoon), twice a day with warm water, honey, or milk.",
    cautions:
      "If you have an autoimmune condition or are on immune-related medication, coordinate with your physician. Pregnant or breastfeeding mothers should consult before starting. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Rasayana / Jwarahara",
    hsnCode: "30049011",
    gst: "12%",
  },

  GKC: {
    sku: "GKC",
    name: "Gokhru Churna",
    tagline: "Gokshura — whole-fruit powder, classical Mutrala.",
    packSizes: "100g · 200g",
    intro: [
      "Gokshura is the small, spiked fruit that classical Ayurveda has used for generations in routine urinary wellness and as a daily Rasayana. The whole fruit is the classical preparation — spikes intact — and that's what we mill.",
      "A spoon with warm water or with milk, the latter being the classical preparation when used for vitality.",
    ],
    whatsInThePack: "100% Gokshura (Tribulus terrestris) whole-fruit powder. Single ingredient.",
    howToUse:
      "3 to 6 grams (½ to 1 teaspoon), twice a day with warm milk or warm water.",
    cautions:
      "If you have a heart condition or are on diuretic medication, consult your physician. Pregnant women should consult before starting. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Mutrala / Vrishya",
    hsnCode: "30049011",
    gst: "12%",
  },

  HRC: {
    sku: "HRC",
    name: "Harde Churna",
    tagline: "Haritaki — the herb classical texts called Mata.",
    packSizes: "100g · 200g",
    intro: [
      "Charaka's classical materia medica calls Haritaki the Mata — mother — among Ayurvedic dravyas, for the universality of its uses. Indian households have kept it for as long as Ayurveda has been written down. Our churna is from authenticated fruits, deseeded and fine-milled.",
      "A spoon at bedtime with warm water — the simplest and most common way to take it.",
    ],
    whatsInThePack:
      "100% Haritaki (Terminalia chebula) deseeded fruit pulp powder. Single ingredient.",
    howToUse:
      "3 to 6 grams (½ to 1 teaspoon) at bedtime with warm water. Classical seasonal anupanas vary — consult your Ayurvedic physician for traditional protocol.",
    cautions:
      "Avoid in the first trimester of pregnancy and during active loose motions. Pregnant or breastfeeding mothers should consult first. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Anulomana / Rasayana",
    hsnCode: "30049011",
    gst: "12%",
  },

  HMC: {
    sku: "HMC",
    name: "Himej Churna",
    tagline: "Himej — gentler Haritaki for the elderly and sensitive.",
    packSizes: "100g · 200g",
    intro: [
      "Himej is the small immature fruit form of Haritaki, classified separately in Bhavaprakasha as a gentler alternative for those who find the full-mature fruit too aggressive. Particularly suited for elderly use and routine daily anulomana.",
    ],
    whatsInThePack:
      "100% Himej / Bal-Haritaki (Terminalia chebula, immature small fruit) powder. Single ingredient.",
    howToUse:
      "2 to 4 grams (½ teaspoon) at bedtime with warm water, honey, or warm milk.",
    cautions:
      "Avoid in the first trimester of pregnancy. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Mild Anulomana",
    hsnCode: "30049011",
    gst: "12%",
  },

  JMC: {
    sku: "JMC",
    name: "Jethimadh Churna",
    tagline: "Yashtimadhu — Mulethi — the sweet stick of classical Ayurveda.",
    packSizes: "100g · 200g",
    intro: [
      "Yashtimadhu — Mulethi, Jethimadh — is one of the most universally indicated single-herb dravyas in classical Indian Ayurveda. Used for throat care, mucosal comfort, and routine wellness. Our churna is from peeled root only — the skin-on supply that's common in cheap retail dilutes the active profile.",
      "A small pinch on the tongue with honey, or stirred into warm water as a gargle.",
    ],
    whatsInThePack:
      "100% Yashtimadhu (Glycyrrhiza glabra) peeled root powder. Single ingredient.",
    howToUse:
      "1 to 3 grams (¼ to ½ teaspoon), twice a day with honey or warm water. Gargle: ½ teaspoon in 100 ml warm water.",
    cautions:
      "If you have high blood pressure or are on related medication, consult your physician — long-term high-dose use of Yashtimadhu should be physician-monitored. Pregnant or breastfeeding mothers should consult before starting. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Madhura / Pittahara",
    hsnCode: "30049011",
    gst: "12%",
  },

  MMC: {
    sku: "MMC",
    name: "Mamejava Churna",
    tagline: "Mamejavo — Saurashtra's regional classical herb.",
    packSizes: "100g · 200g",
    intro: [
      "Mamejavo (Enicostemma littorale) is a specifically Saurashtran herb with a long regional folk-classical reputation, particularly for routine metabolic wellness. Whole-plant collection, sun-dried, milled — the way it's been used in Junagadh and surrounding regions for generations.",
    ],
    whatsInThePack:
      "100% Mamejavo (Enicostemma littorale) whole-plant powder. Single ingredient.",
    howToUse: "1 to 3 grams (¼ to ½ teaspoon), twice a day with warm water.",
    cautions:
      "If you're on regular medication for blood sugar, coordinate with your physician before starting. Pregnant or breastfeeding mothers should consult first. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Madhumeha-anti",
    hsnCode: "30049011",
    gst: "12%",
  },

  NMC: {
    sku: "NMC",
    name: "Nimb Churna",
    tagline: "Pure Neem leaf powder — tender-leaf, shade-dried.",
    packSizes: "100g · 200g",
    intro: [
      "Neem's reputation in Indian household tradition is so universal it barely needs introduction. Tender-leaf Neem, harvested in spring when the active compounds are at their peak, shade-dried at low temperature to keep them — that's the difference between proper Neem powder and the bulk-dried bitter-green flour that fills most supermarket jars.",
    ],
    whatsInThePack:
      "100% Neem (Azadirachta indica) tender-leaf powder, shade-dried. Single ingredient.",
    howToUse:
      "1 to 3 grams (¼ to ½ teaspoon), once or twice a day with honey or warm water.",
    cautions:
      "Pregnant women should avoid. Those trying to conceive should consult their physician — Neem has traditional anti-fertility use. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Tikta / Rakta-shodhaka",
    hsnCode: "30049011",
    gst: "12%",
  },

  PPC: {
    sku: "PPC",
    name: "Pippali Churna",
    tagline: "Pippali — long pepper, the classical Ayurvedic Vrishya.",
    packSizes: "100g · 200g",
    intro: [
      "Pippali is one of classical Ayurveda's most chemically active dravyas — the herb that anchors the famous Vardhamana Pippali Rasayana protocol. Authentic Piper longum has a characteristically aromatic-pungent profile that distinguishes it from the Bengal-grown commercial substitute.",
      "Just a pinch — Pippali is potent. With honey for throat and seasonal support, with warm milk for vitality use.",
    ],
    whatsInThePack: "100% Pippali (Piper longum) dried fruit powder. Single ingredient.",
    howToUse:
      "0.5 to 2 grams (a pinch to ¼ teaspoon), once or twice a day with honey, warm milk, or ghee. Vardhamana Pippali Rasayana: under physician guidance only.",
    cautions:
      "Those with acid reflux should use cautiously. Pregnant or breastfeeding mothers should consult first. Long-term high-dose use can aggravate Pitta — keep within daily limits unless advised otherwise. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Deepan / Vrishya / Rasayana",
    hsnCode: "30049011",
    gst: "12%",
  },

  PPM: {
    sku: "PPM",
    name: "Pippalimula Churna",
    tagline: "Pippali root — classified separately, used precisely.",
    packSizes: "100g · 200g",
    intro: [
      "Bhavaprakasha lists Pippalimula — the root of Piper longum — as a separately named dravya from Pippali fruit. The root has a sharper, more penetrating profile and is preferred in classical practice where deeper digestive action is required. Rarely stocked in retail because the root has to be separately harvested and processed; we maintain the distinction.",
    ],
    whatsInThePack: "100% Pippalimula (Piper longum root) powder. Single ingredient.",
    howToUse:
      "0.5 to 2 grams (a pinch to ¼ teaspoon), once or twice a day with honey, warm water, or ghee. Or as advised by your Ayurvedic physician.",
    cautions:
      "Sharper than the fruit Pippali. Those with acid reflux should avoid. Pregnant women should avoid. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Deepan / Plihahara",
    hsnCode: "30049011",
    gst: "12%",
  },

  PNC: {
    sku: "PNC",
    name: "Punarnava Churna",
    tagline: "Punarnava — she who renews.",
    packSizes: "100g · 200g",
    intro: [
      "Punarnava — Sanskrit for 'she who renews' — earns the name through generations of household use as a Mutrala and Shothahara dravya. We use the whole plant, with the red-stem (Raktavarna) variety preferred per Bhavaprakasha specification.",
    ],
    whatsInThePack:
      "100% Punarnava (Boerhavia diffusa, raktavarna preferred) whole-plant powder. Single ingredient.",
    howToUse: "3 to 6 grams (½ to 1 teaspoon), twice a day with warm water.",
    cautions:
      "If you're on diuretic medication or have a kidney condition, coordinate with your physician. Pregnant or breastfeeding mothers should consult first. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Mutrala / Shothahara",
    hsnCode: "30049011",
    gst: "12%",
  },

  SVC: {
    sku: "SVC",
    name: "Saragava Churna",
    tagline: "Moringa leaf, shade-dried for the nutrients to stay.",
    packSizes: "100g · 200g",
    intro: [
      "Shigru — Moringa, drumstick — is one of those Ayurvedic classical herbs that has achieved global recognition under its English name. The leaf is densely nutritive and has been used in Indian and South Indian household tradition for centuries. Shade-dried below 40°C — most commercial Moringa is sun-dried hot, which loses the heat-sensitive nutrients.",
    ],
    whatsInThePack:
      "100% Moringa / Shigru / Saragavo (Moringa oleifera) leaf powder, shade-dried. Single ingredient.",
    howToUse:
      "3 to 6 grams (½ to 1 teaspoon), once or twice a day with warm water, honey, milk, or mixed into food.",
    cautions:
      "Pregnant women should avoid (Moringa root is contraindicated; leaf use is generally safer but caution warranted). Those with thyroid conditions should moderate use. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Nutritive / Shothahara",
    hsnCode: "30049011",
    gst: "12%",
  },

  STC2: {
    sku: "STC2",
    name: "Shatavari Churna",
    tagline: "Shatavari — pure tuber-root powder, peeled, classical preparation.",
    packSizes: "100g · 200g",
    intro: [
      "Shatavari sits at the top of classical Ayurveda's reproductive Rasayana category for women, and is significant in male vitality use as well. We use peeled tuber root only — the unpeeled root that's common in cheap retail has more fibre and less of the active saponin-rich tissue.",
      "A spoon with warm milk, ideally at night.",
    ],
    whatsInThePack:
      "100% Shatavari (Asparagus racemosus) peeled tuber-root powder. Single ingredient.",
    howToUse:
      "3 to 6 grams (½ to 1 teaspoon), twice a day with warm milk, ghee, honey, or water.",
    cautions:
      "Pregnant or breastfeeding mothers should consult before starting. If you have a hormone-sensitive condition, consult your physician. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Stree-Rasayana / Vrishya",
    hsnCode: "30049011",
    gst: "12%",
  },

  SMC: {
    sku: "SMC",
    name: "Sonamukhi Churna",
    tagline: "Senna — the classical Virechana herb. Use briefly, use precisely.",
    packSizes: "50g · 100g",
    intro: [
      "Sonamukhi — Senna, Swarnapatri — is the most pharmacologically reliable classical Ayurvedic Virechana single-herb. It's powerful, and that means it deserves respect: short-term use only, never as a daily routine. For routine daily anulomana, classical preparations like Erandbhrasht Haritaki or Triphala are far more appropriate.",
    ],
    whatsInThePack: "100% Senna (Senna alexandrina) leaflet powder. Single ingredient.",
    howToUse:
      "1 to 3 grams at bedtime — OCCASIONAL USE ONLY, NOT DAILY. Maximum 7 days continuous.",
    cautions:
      "AVOID DURING PREGNANCY AND BREASTFEEDING. Not for children under 12. Not for those with inflammatory bowel conditions. Long-term use causes bowel dependency. NOT FOR DAILY USE. If you need a daily preparation, use Triphala or Erandbhrasht Haritaki instead. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Virechana",
    hsnCode: "30049011",
    gst: "12%",
  },

  SUC: {
    sku: "SUC",
    name: "Sunth Churna",
    tagline: "Sunth — dried ginger, classical Vishwabheshaja.",
    packSizes: "100g · 200g",
    intro: [
      "Classical materia medica gives dried ginger the epithet Vishwabheshaja — universal medicine — and earns it. The drying process transforms fresh ginger into a deeper, sweeter post-digestive profile, which is why Sunth is the form classical Ayurveda specifies. Sulphur-free, traditionally dried — most commercial Sunth is sulphur-fumigated for cosmetic whiteness; ours is naturally beige and tastes like real ginger.",
    ],
    whatsInThePack:
      "100% Sunth (dried Zingiber officinale rhizome) powder. Sulphur-free. Single ingredient.",
    howToUse:
      "1 to 3 grams (¼ to ½ teaspoon), once or twice a day with warm water, honey, ghee, or jaggery.",
    cautions:
      "Those with acid reflux should use cautiously. If you have a bleeding condition or are on blood-thinning medication, consult your physician. Late pregnancy — consult first. Store tightly closed in a cool dry place.",
    classification: "Single-herb Churna — Deepan / Vatahara",
    hsnCode: "30049011",
    gst: "12%",
  },

  HRT: {
    sku: "HRT",
    name: "Harde Tablet",
    tagline: "Single-herb Haritaki, in tablet form.",
    packSizes: "60 tablets · 120 tablets",
    intro: [
      "Single-herb Haritaki tablets are surprisingly rare — most market 'Haritaki tablets' are actually Triphala in disguise. Ours is genuinely just Haritaki, compressed into 500 mg tablets. For users who want classical Haritaki anulomana without the gentler Erandbhrashtana processing.",
    ],
    whatsInThePack:
      "Each 500 mg tablet contains pure Haritaki (Terminalia chebula) fruit powder, with permitted Ayurvedic excipients. Single-herb formulation.",
    howToUse: "1 to 2 tablets at bedtime with warm water. Or as advised by your Ayurvedic physician.",
    cautions:
      "Avoid in the first trimester of pregnancy. Avoid during active loose motions. Sharper than the Erandbhrashtana variant — those with sensitive digestion may prefer Erandbhrasht Haritaki Tablet instead. Store tightly closed in a cool dry place.",
    classification: "Single-herb Tablet — Anulomana",
    hsnCode: "30049011",
    gst: "12%",
  },

  ARI: {
    sku: "ARI",
    name: "Aritha Churna",
    tagline: "Reetha — the original natural surfactant.",
    packSizes: "100g · 200g",
    intro: [
      "Aritha — Reetha, Soapnut — is one of the most concentrated natural saponin sources, used in Indian households as a botanical surfactant for centuries before synthetic detergents existed. Used alone for hair, in compound powders, for cleaning delicate textiles. Deseeded fruit pericarp only — the seed is fibrous and dilutes the saponin content.",
    ],
    whatsInThePack:
      "100% Aritha (Sapindus mukorossi) deseeded fruit pericarp powder. Single ingredient.",
    howToUse:
      "External: mix 2 tablespoons with warm water into a paste, apply to wet hair, lather, rinse thoroughly.",
    cautions:
      "FOR EXTERNAL USE ONLY. Avoid contact with eyes — highly irritant. Patch test before first use. Keep out of children's reach. Store dry and tightly closed.",
    classification: "Single-herb Churna — External / Cosmetic",
    hsnCode: "33059040",
    gst: "18%",
  },

  JSC: {
    sku: "JSC",
    name: "Jasud Churna",
    tagline: "Red hibiscus flower powder — the classical Keshya.",
    packSizes: "100g · 200g",
    intro: [
      "Red hibiscus has been the classical Keshya — hair-care — flower in Indian household Ayurveda for as long as it's been written down. Used as a hair pack on its own, or mixed with curd, methi, amla. Shade-dried for the anthocyanins to stay; sun-dried hibiscus loses what makes it red and what makes it useful.",
    ],
    whatsInThePack:
      "100% Japa / Jasud (Hibiscus rosa-sinensis, red variety) flower powder, shade-dried. Single ingredient.",
    howToUse:
      "External: mix 2 tablespoons with curd or warm water into a paste, apply to wet hair, leave 30 minutes, rinse.",
    cautions:
      "FOR EXTERNAL USE ONLY. Patch test before first use. Mild natural staining of light fabrics — protect during use. Store dry, tightly closed.",
    classification: "Single-herb Churna — External / Keshya",
    hsnCode: "33059040",
    gst: "18%",
  },

  MMM: {
    sku: "MMM",
    name: "Multani Mitti Churna",
    tagline: "Multani Mitti — Fuller's earth, the original face pack.",
    packSizes: "100g · 200g",
    intro: [
      "Multani Mitti — Fuller's earth, calcium bentonite — is among the oldest external skin-care preparations in Indian household tradition. Mix with rosewater, curd, milk, or simply water; apply, leave, rinse. Our Multani Mitti is fine-sieved and free from grit and contaminating soil.",
    ],
    whatsInThePack:
      "100% Multani Mitti (calcium bentonite mineral clay), fine-sieved. No additions.",
    howToUse:
      "External: mix 1–2 tablespoons with rosewater, milk, or water into a paste; apply to face/skin, leave 15 minutes, rinse with cool water.",
    cautions:
      "FOR EXTERNAL USE ONLY. Very dry skin — moderate use frequency. Patch test before first use. Avoid contact with eyes. Store dry and tightly closed.",
    classification: "Mineral / External / Cosmetic",
    hsnCode: "25081020",
    gst: "5%",
  },

  NLC: {
    sku: "NLC",
    name: "Nili Churna",
    tagline: "Indigo leaf — the classical natural hair-darkener.",
    packSizes: "100g · 200g",
    intro: [
      "Nili — Indigo, Indigofera tinctoria — is the classical second half of India's two-step natural hair-colour tradition: henna first, indigo second. Used alone for darker tones; with henna for browns to black depending on ratio. Low-temperature dried so the indican (the precursor that delivers the colour) is preserved — high-temperature drying makes indigo cosmetically green and chemically inert.",
    ],
    whatsInThePack:
      "100% Nili (Indigofera tinctoria) leaf powder, low-temperature dried. Single ingredient.",
    howToUse:
      "External: mix 2–4 tablespoons with warm water into a paste, apply to clean dry/damp hair, leave 1–2 hours, rinse.",
    cautions:
      "FOR EXTERNAL USE ONLY. Patch test mandatory before first use. Pregnant women should avoid hair-colouring as a category. Store tightly closed away from light. Best used within 6–12 months — indican degrades with time.",
    classification: "Single-herb Churna — External / Hair",
    hsnCode: "33059040",
    gst: "18%",
  },

  SKC: {
    sku: "SKC",
    name: "Shikakai Churna",
    tagline: "Shikakai — the original Indian hair-wash.",
    packSizes: "100g · 200g",
    intro: [
      "Shikakai's name literally means 'fruit for the hair' — and the pod has been the principal Indian natural hair-cleanser for over a thousand years. Mildly acidic (pH ~4.5), naturally surfactant, gentle on the cuticle. Deseeded pods only — the seed is the most common cost-cutting tactic in commercial Shikakai.",
    ],
    whatsInThePack:
      "100% Shikakai (Acacia concinna) deseeded pod powder. Single ingredient.",
    howToUse:
      "External: mix 2 tablespoons with warm water into a paste, apply to wet hair, lather gently, rinse thoroughly.",
    cautions:
      "FOR EXTERNAL USE ONLY. Avoid contact with eyes — flush with cool water if it gets in. Patch test before first use. Store dry, tightly closed.",
    classification: "Single-herb Churna — External / Hair",
    hsnCode: "33059040",
    gst: "18%",
  },

  TIT: {
    sku: "TIT",
    name: "Tila Taila",
    tagline: "Cold-pressed white sesame oil — the classical base.",
    packSizes: "100 ml · 200 ml",
    intro: [
      "Tila Taila is the foundational Sneha base of classical Ayurveda — the oil that all classical Sneha Kalpana, Murchhana, and Anu Tailas are built on. Cold-pressed from white sesame at temperatures below 35°C — most commercial 'cold-pressed' actually heats to 60°C, which degrades the lignan profile. Suitable for Abhyanga, Gandusha, classical Taila preparation, and high-quality culinary use.",
    ],
    whatsInThePack:
      "100% cold-pressed white sesame (Tila, Sesamum indicum) seed oil. Single-source pressing. No additions.",
    howToUse:
      "Abhyanga: 25–50 ml warmed slightly, applied externally. Gandusha: 1 tbsp swished in mouth 5–10 minutes. Culinary: as required.",
    cautions:
      "Sesame allergy — avoid. Patch test before first external use if you have sensitive skin. Store in dark glass, away from sunlight, in a cool dry place.",
    classification: "Base Taila — Cold-pressed",
    hsnCode: "30049011",
    gst: "12%",
  },

  SRT: {
    sku: "SRT",
    name: "Sarson Taila",
    tagline: "Cold-pressed mustard oil — kachi ghani, no shortcuts.",
    packSizes: "100 ml · 200 ml",
    intro: [
      "Mustard oil sits in an unusual place in Indian tradition — a classical Ayurvedic Taila and one of the most important culinary oils across North and East India. Ours is kachi ghani — slow-pressed at low temperature, single-source, lightly filtered. The pungency is the way real mustard oil tastes; refined mustard oil has none of it, and none of the classical character.",
    ],
    whatsInThePack:
      "100% kachi ghani cold-pressed mustard (Sarshapa, Brassica juncea) seed oil. Single-source. No additions.",
    howToUse:
      "External (massage, scalp care, skin care): apply as required. Culinary: as per traditional cuisine.",
    cautions:
      "External: patch test before first use; mustard oil is tikshna and may irritate sensitive skin. Pregnant women should moderate culinary use. Those with strong acidity should moderate. Store in dark glass, cool dry place, away from sunlight.",
    classification: "Base Taila — Cold-pressed",
    hsnCode: "15141990",
    gst: "5% (edible) / 12% (Ayurvedic Taila)",
  },
};

/**
 * Helper: look up a product description by SKU code OR by slug.
 * Try SKU first (DBC, GHO, etc.), then fall back to fuzzy slug match.
 */
export function getProductDescription(skuOrSlug: string): ProductDescription | null {
  const upper = skuOrSlug.toUpperCase();
  if (productDescriptions[upper]) return productDescriptions[upper];

  const slug = skuOrSlug.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const desc of Object.values(productDescriptions)) {
    const nameSlug = desc.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (nameSlug === slug || nameSlug.includes(slug) || slug.includes(nameSlug)) {
      return desc;
    }
  }

  return null;
}

/**
 * Shared regulatory information — same across all SKUs.
 * Used to render the collapsible accordion at the bottom of every product page.
 */
export const regulatoryInfo = {
  manufacturer:
    "Gandhi Brothers, Gomti Bhavan, Azad Chowk, Junagadh – 362001, Gujarat, India",
  licence: "GA/2079 (Form 25D), FDCA Gujarat",
  countryOfOrigin: "India",
  gstin: "24AAMFG2812L2ZC",
  customerCare: "+91 91069 80909",
  email: "support@gandhibrothers.co.in",
  web: "www.gandhibrothers.co.in",
  disclaimer:
    "Ayurvedic Medicine. To be used as part of a healthy lifestyle. Not intended to diagnose, treat, cure, or prevent any disease.",
};
