# Gandhi Brothers — SEO Growth Playbook

The website is now technically optimised: structured data, sitemap, robots, canonicals,
per-category landing pages, a blog, and a reviews system are all live in code. **That part is
done.** This document covers the operational and off-page work — roughly 80–90% of what actually
moves rankings — which can only be done by you (it needs accounts, verification, and real-world
relationships).

Work top to bottom. Items are ordered by impact-for-effort.

---

## 1. Google Business Profile (highest local impact, ~30 min)

For a physical manufacturer in Junagadh, this is the single biggest win. It powers the Google
Maps listing and the "local pack" that appears for searches like *"ayurvedic manufacturer
junagadh"*. It also reinforces the `LocalBusiness` schema already on the site.

1. Go to <https://business.google.com> and sign in with a Google account you control.
2. **Create / claim** the business: **Gandhi Brothers**.
   - Category: *Ayurvedic / Herbal Medicine Manufacturer* (and add *Alternative Medicine Store*).
   - Address: **Gomti Bhavan, Azad Chowk, Junagadh – 362001, Gujarat**.
   - Phone: **+91 91069 80909** · Website: **https://gandhibrothers.co.in**
   - Hours: **Mon–Sat 10:00–20:00, closed Sunday** (matches the site schema).
3. **Verify** ownership (postcard, phone, or video — Google will offer options).
4. After verifying, **pin the exact map location**. The site schema currently uses approximate
   coordinates (21.5222, 70.4579); once you place the pin, copy the precise lat/long from the
   Maps URL and send them over so the schema can be made exact.
5. Add **photos** (storefront, products, the facility), and keep hours/holidays updated.

> Tip: ask happy customers to leave Google reviews here too — Google reviews and on-site reviews
> are separate and both help.

---

## 2. Google Search Console + Bing Webmaster Tools (~20 min)

This is how you tell Google your site exists, submit the sitemap, and watch which queries you
rank for.

### Google Search Console
1. Go to <https://search.google.com/search-console> → **Add property** → **URL prefix** →
   `https://gandhibrothers.co.in`.
2. Choose the **HTML tag** verification method. Copy **only the token** from inside
   `content="..."` (not the whole tag).
3. Put it in `.env.local`:
   ```
   GOOGLE_SITE_VERIFICATION=the_token_you_copied
   ```
   Redeploy. The site renders the verification `<meta>` automatically (already wired in
   `src/app/layout.tsx`). Click **Verify**.
4. In Search Console → **Sitemaps**, submit: `sitemap.xml`
5. Use **URL Inspection** → *Request indexing* for the homepage and a few key product pages to
   speed up first indexing.

### Bing Webmaster Tools
1. Go to <https://www.bing.com/webmasters> → add the site (you can import from Search Console).
2. For meta-tag verification, copy the token and set:
   ```
   BING_SITE_VERIFICATION=the_token_you_copied
   ```
3. Submit `https://gandhibrothers.co.in/sitemap.xml`.

> Check back weekly. Search Console's *Performance* and *Pages* reports tell you what's working.

---

## 3. Reviews — collect real ones, then they go live automatically

The site has a full reviews system (submit form on every product page, moderation, and
`AggregateRating` rich-result markup). It is **dormant until you add real reviews** — by design,
because fake ratings get sites penalised.

### One-time setup: add the "Reviews" tab to your Google Sheet
1. Open the same Google Sheet used for Products/Orders.
2. Add a new tab named exactly **`Reviews`**.
3. Put these headers in row 1 (columns A–G):

   | A | B | C | D | E | F | G |
   |---|---|---|---|---|---|---|
   | Timestamp | Product Key | Name | Rating | Title | Body | Status |

4. The service account already has access (same sheet), so nothing else is needed.

### How it works
- Customers submit reviews from the product page → a row is appended with **Status = `Pending`**.
- Reviews appear on the site **only after you change Status to `Approved`**.
- **Product Key** is the product slug without the pack-size suffix (e.g. `ashwagandha-churna`),
  so all pack sizes of one product share reviews. Submitted reviews fill this in automatically;
  if you add reviews by hand, use that format.
- **Rating** is a whole number 1–5.
- As soon as one approved review exists, the star rating and `AggregateRating` schema turn on for
  that product — which is what can earn star snippets in Google results.

### How to get reviews
- Email past customers a direct link to the product page and ask for an honest review.
- Add a small "review request" line to your order-confirmation email/WhatsApp follow-up.
- Never offer payment or incentives for positive reviews (against Google policy).

---

## 4. Backlinks — the long, durable lever

Links from other reputable sites are still one of the strongest ranking signals. Quality and
relevance beat quantity. Focus on Ayurveda-relevant and India-local sources.

### Target list
- **Business directories / listings:** JustDial, IndiaMART, TradeIndia, Sulekha, Google Business
  Profile (above), Bing Places, Apple Business Connect.
- **Ayurveda & industry:** local Ayurvedic practitioner associations, Gujarat Ayurved
  associations, FDCA/AYUSH-related directories, B2B pharma/herbal marketplaces.
- **Local & regional:** Junagadh / Saurashtra business directories, Gujarat MSME listings, local
  chamber of commerce, regional news features about local manufacturers.
- **Relationships:** suppliers, distributors, retailers, and practitioners who already stock or
  recommend you — ask each for a link from their site.
- **Content:** the blog gives others a reason to link (e.g. the "what an FDCA licence means"
  article is genuinely useful and citable).

### Outreach email template
> **Subject:** Partnership — Gandhi Brothers (FDCA-licensed Ayurvedic manufacturer, Junagadh)
>
> Hello [Name],
>
> We're Gandhi Brothers, an FDCA-licensed Ayurvedic manufacturer in Junagadh (Licence GA/2079),
> making classical churnas and tailas since 1950. I came across [their site/directory] and thought
> we'd be a good fit for [their audience / your directory of Ayurvedic manufacturers].
>
> Would you consider listing or linking to us at https://gandhibrothers.co.in? Happy to share
> product details, photos, or our certifications page.
>
> Thank you,
> [Your name] · Gandhi Brothers · +91 91069 80909

### Review-request template
> **Subject:** How are you finding [product]?
>
> Hi [Name], thank you for your recent order of [product]. If you have a moment, we'd really value
> an honest review — it helps other customers choose. You can leave one here: [product page URL].
> Thank you! — Gandhi Brothers

---

## 5. Ongoing content (compounding)

Three articles are live in the Journal (`/blog`). Publishing **1–2 useful, compliance-safe
articles a month** is the most reliable way to grow non-branded traffic over time.

Safe, high-intent topics (no disease/treatment claims):
- Ingredient explainers framed traditionally (what it is, how it's traditionally used).
- "How to read an Ayurvedic label" / "How to store churnas and tailas".
- Heritage and sourcing stories.
- Buying guides ("how to choose a pack size", "churna vs tablet").

To add an article: append an entry to `articles` in `src/lib/blog.ts` (it auto-appears in the
Journal, the sitemap, and gets full Article structured data). Keep copy DMR-Act compliant — no
claims to diagnose, treat, cure, or prevent.

---

## 6. Quick checklist

- [ ] Create & verify Google Business Profile; pin exact location; send precise lat/long.
- [ ] Verify Google Search Console; set `GOOGLE_SITE_VERIFICATION`; submit `sitemap.xml`.
- [ ] Verify Bing Webmaster; set `BING_SITE_VERIFICATION`; submit sitemap.
- [ ] Add the `Reviews` tab to the Google Sheet; start requesting honest reviews.
- [ ] Submit to 5–10 directories from the target list this month.
- [ ] Ask 3 partners/suppliers for a link.
- [ ] Publish one new Journal article per month.
- [ ] Review Search Console *Performance* weekly and double down on what ranks.

---

*Everything in code (schema, sitemap, robots, canonicals, blog, reviews) is already done and
verified. This list is the human side of ranking — it's where the real gains are now.*
