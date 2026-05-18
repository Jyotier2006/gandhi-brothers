import { ProductDescription } from "@/lib/product-descriptions";
import RegulatoryAccordion from "./RegulatoryAccordion";

interface Props {
  product: ProductDescription;
}

/**
 * Renders the full marketing-first content block on a product detail page.
 * Drop this in below your existing add-to-cart section.
 *
 * Structure:
 *   1. Tagline (serif, large)
 *   2. Intro paragraphs (flowing prose)
 *   3. What's in the pack (boxed)
 *   4. How to use (boxed)
 *   5. A few things worth noting (boxed, slightly warm)
 *   6. Regulatory accordion (collapsed by default)
 */
export default function ProductRichContent({ product }: Props) {
  return (
    <div className="mt-8 max-w-3xl">
      {/* Tagline */}
      <p className="font-serif text-xl sm:text-2xl text-[#6B4A35] italic mb-8 leading-relaxed">
        {product.tagline}
      </p>

      {/* Intro paragraphs */}
      <div className="space-y-5 text-[#6B4A35] leading-relaxed">
        {product.intro.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* Detail boxes */}
      <div className="mt-10 space-y-5">
        <DetailBox title="What's in the pack" body={product.whatsInThePack} />
        <DetailBox title="How to use" body={product.howToUse} />
        <DetailBox
          title="A few things worth noting"
          body={product.cautions}
          warm
        />
      </div>

      {/* Regulatory accordion */}
      <RegulatoryAccordion product={product} />
    </div>
  );
}

function DetailBox({
  title,
  body,
  warm = false,
}: {
  title: string;
  body: string;
  warm?: boolean;
}) {
  return (
    <div
      className={`border-l-2 pl-5 py-2 ${
        warm ? "border-[#D9A536]" : "border-[#A57051]"
      }`}
    >
      <h3 className="font-serif text-lg text-[#6B4A35] mb-2">{title}</h3>
      <p className="text-[#6B4A35] leading-relaxed text-[15px]">{body}</p>
    </div>
  );
}
