import InquiryForm from "@/components/inquiry-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inquiries | Gandhi Brothers",
  description: "Identify your role and tell us about your requirement. We'll route your inquiry to the right desk.",
};

export default function InquiryPage() {
  return (
    <div className="bg-[#F2EDE4] min-h-screen text-[#6B4A35] pb-20">
      {/* ── Hero Section ── */}
      <section className="py-16 md:py-24 px-4 text-center max-w-4xl mx-auto flex flex-col items-center">
        <p className="text-xs text-[#A57051] uppercase tracking-[0.2em] font-medium mb-4">
          Inquiries
        </p>
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-[#6B4A35]"
          style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}
        >
          Get in touch
        </h1>
        <div className="w-[60px] h-[2px] bg-[#A57051] mt-6 mb-6 mx-auto" />
        <p className="text-[#6B4A35] md:text-lg font-serif italic max-w-xl">
          Tell us who you are. We'll route your inquiry to the right desk and respond with the right documentation.
        </p>
      </section>

      {/* ── Layout Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        <div className="lg:col-span-8 bg-white border border-[#A69279]/20 rounded-xl p-6 md:p-10 shadow-sm min-h-[500px]">
          <InquiryForm />
        </div>
        
        <div className="lg:col-span-4 sticky top-[100px] bg-white border border-[#A69279]/20 rounded-xl p-8 shadow-sm">
          <h3 className="font-semibold text-lg text-[#6B4A35] font-serif mb-6">Other ways to reach us</h3>
          <div className="space-y-6 text-sm text-[#6B4A35]/80">
            <div>
              <p className="font-semibold text-[#A57051] text-xs uppercase tracking-wider mb-1">Email</p>
              <a href="mailto:support@gandhibrothers.co.in" className="hover:text-[#A57051] transition-colors text-base font-medium">support@gandhibrothers.co.in</a>
            </div>
            <div>
              <p className="font-semibold text-[#A57051] text-xs uppercase tracking-wider mb-1">Mobile / WhatsApp</p>
              <a href="tel:+919106980909" className="hover:text-[#A57051] transition-colors text-base font-medium">+91 91069 80909</a>
            </div>
            <div>
              <p className="font-semibold text-[#A57051] text-xs uppercase tracking-wider mb-1">Instagram</p>
              <a href="https://instagram.com/gandhi_brothers9" target="_blank" rel="noopener noreferrer" className="hover:text-[#A57051] transition-colors text-base font-medium">@gandhi_brothers9</a>
            </div>
            <div>
              <p className="font-semibold text-[#A57051] text-xs uppercase tracking-wider mb-1">Address</p>
              <p className="leading-relaxed text-base font-medium">Gomti Bhavan, Azad Chowk,<br/>Junagadh – 362001, Gujarat, India</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
