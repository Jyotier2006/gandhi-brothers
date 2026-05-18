"use client";

import { useState } from "react";
import { regulatoryInfo, ProductDescription } from "@/lib/product-descriptions";

interface Props {
  product: ProductDescription;
}

/**
 * Collapsible accordion showing manufacturer & regulatory info.
 * Collapsed by default per Consumer Protection (E-Commerce) Rules 2020 —
 * info is on-page but doesn't clutter the marketing-first hero.
 */
export default function RegulatoryAccordion({ product }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-[#A57051]/30 mt-12 pt-6">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left py-3 group"
        aria-expanded={open}
      >
        <span className="font-serif text-lg text-[#6B4A35]">
          Manufacturer &amp; Regulatory Information
        </span>
        <span
          className={`text-[#A57051] text-2xl font-light transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      {open && (
        <div className="pt-4 pb-2 text-sm text-[#6B4A35] space-y-3 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#A57051] mb-1">
                Manufacturer
              </div>
              <div>{regulatoryInfo.manufacturer}</div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-[#A57051] mb-1">
                Manufacturing Licence
              </div>
              <div>{regulatoryInfo.licence}</div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-[#A57051] mb-1">
                Classification
              </div>
              <div>{product.classification}</div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-[#A57051] mb-1">
                Country of Origin
              </div>
              <div>{regulatoryInfo.countryOfOrigin}</div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-[#A57051] mb-1">
                GSTIN
              </div>
              <div>{regulatoryInfo.gstin}</div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-[#A57051] mb-1">
                HSN Code &amp; GST
              </div>
              <div>
                {product.hsnCode} · {product.gst}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-[#A57051] mb-1">
                Customer Care
              </div>
              <div>
                <a
                  href={`tel:${regulatoryInfo.customerCare.replace(/\s/g, "")}`}
                  className="hover:text-[#A57051]"
                >
                  {regulatoryInfo.customerCare}
                </a>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-[#A57051] mb-1">
                Email &amp; Web
              </div>
              <div>
                <a
                  href={`mailto:${regulatoryInfo.email}`}
                  className="hover:text-[#A57051] block"
                >
                  {regulatoryInfo.email}
                </a>
                <a
                  href={`https://${regulatoryInfo.web}`}
                  className="hover:text-[#A57051] block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {regulatoryInfo.web}
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-[#A57051]/20 text-xs italic text-[#6B4A35]/80">
            {regulatoryInfo.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
}
