"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const VISITOR_TYPES = [
  "Doctor / Vaidya / Clinic",
  "Retailer / Pharmacy",
  "Distributor / Wholesaler",
  "Export Buyer (International)",
  "Hospital / Institution",
  "Private Label / Third-Party Manufacturing",
  "Researcher / Student",
  "End Consumer / Patient"
] as const;
type VisitorType = typeof VISITOR_TYPES[number];

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-[#A57051] uppercase tracking-wider mb-2">
      {children}
      {required && <span className="text-[#A57051] ml-1">*</span>}
    </label>
  );
}

function InputField({ label, required, value, onChange, type = "text", placeholder = "", autoFocus = false }: any) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-[#F2EDE4]/30 border border-[#A57051]/30 rounded-lg px-4 py-3 text-sm text-[#6B4A35] font-sans placeholder:text-[#6B4A35]/40 focus:outline-none focus:ring-2 focus:ring-[#A57051]/30 focus:border-[#A57051] transition-all"
      />
    </div>
  );
}

function TextAreaField({ label, required, value, onChange, placeholder = "" }: any) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <textarea
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full bg-[#F2EDE4]/30 border border-[#A57051]/30 rounded-lg px-4 py-3 text-sm text-[#6B4A35] font-sans placeholder:text-[#6B4A35]/40 focus:outline-none focus:ring-2 focus:ring-[#A57051]/30 focus:border-[#A57051] transition-all"
      />
    </div>
  );
}

function RadioGroup({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${value === opt ? 'border-[#A57051] bg-[#A57051]' : 'border-[#A57051]/40 bg-[#F2EDE4]/30 group-hover:border-[#A57051]/80'}`}>
              {value === opt && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <span className="text-sm font-medium text-[#6B4A35]">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckboxGroup({ label, options, value = [], onChange }: { label: string, options: string[], value: string[], onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter(o => o !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${value.includes(opt) ? 'border-[#A57051] bg-[#A57051]' : 'border-[#A57051]/40 bg-[#F2EDE4]/30 group-hover:border-[#A57051]/80'}`}>
              {value.includes(opt) && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
            <span className="text-sm font-medium text-[#6B4A35]">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function InquiryForm() {
  const [visitorType, setVisitorType] = useState<VisitorType | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [common, setCommon] = useState({
    fullName: "",
    mobileNumber: "",
    emailAddress: "",
    city: "",
    state: "",
    country: "India",
    message: "",
  });

  const [categoryData, setCategoryData] = useState<Record<string, any>>({});
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  const handleCategoryChange = (key: string, val: any) => {
    setCategoryData(prev => ({ ...prev, [key]: val }));
  };

  const handleTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVisitorType(e.target.value as VisitorType);
    setCategoryData({}); // Reset specific data on switch
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent catch
    if (!consent) {
      setErrorMsg("Please agree to be contacted.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const payload = {
        ...common,
        visitorType,
        categoryData,
        consent,
        marketingOptIn,
        honeypot
      };

      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-[#A57051]/10 rounded-full flex items-center justify-center mb-2">
          <Check className="w-8 h-8 text-[#A57051]" />
        </div>
        <h3 className="text-2xl font-semibold text-[#6B4A35]" style={{ fontFamily: "Georgia, 'Liberation Serif', serif" }}>Thank you.</h3>
        <p className="text-[#6B4A35]/80 max-w-md font-serif leading-relaxed">
          We've received your inquiry and will respond within 1–2 business days.
        </p>
        <p className="text-[#6B4A35] font-serif italic font-medium pt-2">— Gandhi Brothers, Junagadh.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submitForm} className="space-y-8 animate-in fade-in duration-500">
      
      {/* ── Type Selector ── */}
      <div>
        <label className="block text-sm font-semibold text-[#A57051] uppercase tracking-wider mb-2">
          I am a... <span className="text-[#A57051]">*</span>
        </label>
        <div className="relative">
          <select 
            value={visitorType} 
            onChange={handleTypeSelect}
            required
            className="w-full appearance-none bg-[#F2EDE4]/40 border-2 border-[#A57051]/20 rounded-xl px-5 py-4 text-base font-semibold text-[#6B4A35] focus:outline-none focus:border-[#A57051] transition-all cursor-pointer"
          >
            <option value="" disabled>Select your category</option>
            {VISITOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A57051] pointer-events-none w-5 h-5" />
        </div>
      </div>

      {visitorType && (
        <div className="space-y-10 animate-in slide-in-from-top-4 fade-in duration-500">
          <hr className="border-[#A69279]/20" />
          
          {/* ── Common Fields ── */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[#6B4A35]" style={{ fontFamily: "Georgia, serif" }}>Contact Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField label="Full Name" required value={common.fullName} onChange={(v: string) => setCommon({...common, fullName: v})} autoFocus />
              <InputField 
                label={visitorType === "Export Buyer (International)" ? "Mobile Number (with country code)" : "Mobile Number"} 
                required 
                type="tel"
                value={common.mobileNumber} 
                onChange={(v: string) => setCommon({...common, mobileNumber: v})} 
              />
              <InputField label="Email Address" required type="email" value={common.emailAddress} onChange={(v: string) => setCommon({...common, emailAddress: v})} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <InputField label="City" required value={common.city} onChange={(v: string) => setCommon({...common, city: v})} />
              <InputField label="State / Province" value={common.state} onChange={(v: string) => setCommon({...common, state: v})} />
              <InputField label="Country" required value={common.country} onChange={(v: string) => setCommon({...common, country: v})} />
            </div>
          </div>

          <hr className="border-[#A69279]/20" />

          {/* ── Category Specific Fields ── */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[#6B4A35]" style={{ fontFamily: "Georgia, serif" }}>Specific Requirements</h3>
            
            {visitorType === "Doctor / Vaidya / Clinic" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField label="Clinic or Hospital Name" value={categoryData["Clinic Name"] || ""} onChange={(v: string) => handleCategoryChange("Clinic Name", v)} />
                  <InputField label="BAMS / MD (Ayurveda) Registration Number" value={categoryData["Registration Number"] || ""} onChange={(v: string) => handleCategoryChange("Registration Number", v)} />
                  <InputField label="Years of Practice" type="number" value={categoryData["Years Practice"] || ""} onChange={(v: string) => handleCategoryChange("Years Practice", v)} />
                  <InputField label="Approximate Monthly Indent (units)" type="number" value={categoryData["Monthly Indent"] || ""} onChange={(v: string) => handleCategoryChange("Monthly Indent", v)} />
                </div>
                <CheckboxGroup 
                  label="Products of Interest" 
                  options={["Churna", "Tablet", "Capsule", "Asava-Arishta", "Taila", "Bhasma"]} 
                  value={categoryData["Products"] || []} 
                  onChange={(v) => handleCategoryChange("Products", v)} 
                />
                <RadioGroup 
                  label="Requirement Type" 
                  options={["Sample", "Catalogue", "Direct Supply", "Custom Packing"]} 
                  value={categoryData["Requirement Type"] || ""} 
                  onChange={(v) => handleCategoryChange("Requirement Type", v)} 
                />
              </>
            )}

            {visitorType === "Retailer / Pharmacy" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField label="Shop Name" value={categoryData["Shop Name"] || ""} onChange={(v: string) => handleCategoryChange("Shop Name", v)} />
                  <InputField label="GSTIN" value={categoryData["GSTIN"] || ""} onChange={(v: string) => handleCategoryChange("GSTIN", v)} />
                  <InputField label="Form 20B / 21B / Ayurvedic Retail Licence" value={categoryData["Drug Licence Number"] || ""} onChange={(v: string) => handleCategoryChange("Drug Licence Number", v)} />
                  <InputField label="Years in Trade" type="number" value={categoryData["Years in Trade"] || ""} onChange={(v: string) => handleCategoryChange("Years in Trade", v)} />
                  <InputField label="Current Ayurvedic Brands Stocked" value={categoryData["Brands Stocked"] || ""} onChange={(v: string) => handleCategoryChange("Brands Stocked", v)} />
                </div>
                <RadioGroup 
                  label="Preferred Order Frequency" 
                  options={["Weekly", "Fortnightly", "Monthly"]} 
                  value={categoryData["Order Frequency"] || ""} 
                  onChange={(v) => handleCategoryChange("Order Frequency", v)} 
                />
              </>
            )}

            {visitorType === "Distributor / Wholesaler" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField label="Firm Name" value={categoryData["Firm Name"] || ""} onChange={(v: string) => handleCategoryChange("Firm Name", v)} />
                  <InputField label="GSTIN" value={categoryData["GSTIN"] || ""} onChange={(v: string) => handleCategoryChange("GSTIN", v)} />
                  <InputField label="Wholesale Drug Licence Number (Form 20B / 21B)" value={categoryData["Drug Licence Number"] || ""} onChange={(v: string) => handleCategoryChange("Drug Licence Number", v)} />
                  <InputField label="Territory or Districts Covered" value={categoryData["Territory"] || ""} onChange={(v: string) => handleCategoryChange("Territory", v)} />
                  <InputField label="Existing Principal Companies Handled" value={categoryData["Companies Handled"] || ""} onChange={(v: string) => handleCategoryChange("Companies Handled", v)} />
                  <InputField label="Godown Area (sq ft)" type="number" value={categoryData["Godown Area"] || ""} onChange={(v: string) => handleCategoryChange("Godown Area", v)} />
                  <InputField label="Sales Team Size" type="number" value={categoryData["Sales Team Size"] || ""} onChange={(v: string) => handleCategoryChange("Sales Team Size", v)} />
                  <InputField label="Approximate Monthly Turnover (Ayurvedic Segment)" value={categoryData["Turnover"] || ""} onChange={(v: string) => handleCategoryChange("Turnover", v)} />
                </div>
              </>
            )}

            {visitorType === "Export Buyer (International)" && (
              <>
                <div className="bg-[#D9A536]/10 border border-[#D9A536]/30 px-4 py-3 rounded-lg mb-6">
                  <p className="text-sm text-[#A57051] font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9A536]" />
                    Note: Bhasma, Rasaushadhi, and Asava-Arishta formulations are excluded from export.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField label="Company Name" value={categoryData["Company Name"] || ""} onChange={(v: string) => handleCategoryChange("Company Name", v)} />
                  <InputField label="Importer Licence or Registration Number" value={categoryData["Importer Licence"] || ""} onChange={(v: string) => handleCategoryChange("Importer Licence", v)} />
                  <InputField label="Products of Interest" value={categoryData["Products"] || ""} onChange={(v: string) => handleCategoryChange("Products", v)} />
                  <InputField label="First-Order Quantity" value={categoryData["First Order Qty"] || ""} onChange={(v: string) => handleCategoryChange("First Order Qty", v)} />
                </div>
                <CheckboxGroup 
                  label="Target Market Regulatory Status" 
                  options={["UAE MOH", "US FDA", "EU", "Other"]} 
                  value={categoryData["Regulatory Status"] || []} 
                  onChange={(v) => handleCategoryChange("Regulatory Status", v)} 
                />
                <CheckboxGroup 
                  label="Required Documents" 
                  options={["FSC", "NCC", "CoA", "COPP", "Halal", "GMP Certificate"]} 
                  value={categoryData["Required Documents"] || []} 
                  onChange={(v) => handleCategoryChange("Required Documents", v)} 
                />
                <RadioGroup 
                  label="Preferred Incoterm" 
                  options={["FOB", "CIF", "EXW"]} 
                  value={categoryData["Incoterm"] || ""} 
                  onChange={(v) => handleCategoryChange("Incoterm", v)} 
                />
              </>
            )}

            {visitorType === "Hospital / Institution" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField label="Institution Name" value={categoryData["Institution Name"] || ""} onChange={(v: string) => handleCategoryChange("Institution Name", v)} />
                  <InputField label="Procurement Contact Person" value={categoryData["Contact Person"] || ""} onChange={(v: string) => handleCategoryChange("Contact Person", v)} />
                  <InputField label="Designation" value={categoryData["Designation"] || ""} onChange={(v: string) => handleCategoryChange("Designation", v)} />
                  <InputField label="Approximate Annual Indent Value" value={categoryData["Annual Indent"] || ""} onChange={(v: string) => handleCategoryChange("Annual Indent", v)} />
                </div>
                <RadioGroup 
                  label="Institution Type" 
                  options={["Government", "Private", "Trust"]} 
                  value={categoryData["Institution Type"] || ""} 
                  onChange={(v) => handleCategoryChange("Institution Type", v)} 
                />
                <RadioGroup 
                  label="Mode of Purchase" 
                  options={["Tender", "Rate Contract", "Open Purchase"]} 
                  value={categoryData["Purchase Mode"] || ""} 
                  onChange={(v) => handleCategoryChange("Purchase Mode", v)} 
                />
                <RadioGroup 
                  label="Pharmacopoeial Requirement" 
                  options={["API Standard", "Proprietary"]} 
                  value={categoryData["Pharma Requirement"] || ""} 
                  onChange={(v) => handleCategoryChange("Pharma Requirement", v)} 
                />
              </>
            )}

            {visitorType === "Private Label / Third-Party Manufacturing" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField label="Brand Name (if existing)" value={categoryData["Brand Name"] || ""} onChange={(v: string) => handleCategoryChange("Brand Name", v)} />
                  <InputField label="FSSAI / Drug Licence Number (if any)" value={categoryData["Licence"] || ""} onChange={(v: string) => handleCategoryChange("Licence", v)} />
                  <InputField label="Target MRP Range" value={categoryData["Target MRP"] || ""} onChange={(v: string) => handleCategoryChange("Target MRP", v)} />
                  <InputField label="Expected MOQ" value={categoryData["MOQ"] || ""} onChange={(v: string) => handleCategoryChange("MOQ", v)} />
                  <InputField label="Launch Timeline" value={categoryData["Launch Timeline"] || ""} onChange={(v: string) => handleCategoryChange("Launch Timeline", v)} />
                </div>
                <CheckboxGroup 
                  label="Product Category" 
                  options={["Churna", "Tablet", "Capsule", "Oil", "Cosmetic"]} 
                  value={categoryData["Category"] || []} 
                  onChange={(v) => handleCategoryChange("Category", v)} 
                />
                <RadioGroup 
                  label="Packaging Requirement" 
                  options={["Own Artwork Provided", "Design Support Needed"]} 
                  value={categoryData["Packaging"] || ""} 
                  onChange={(v) => handleCategoryChange("Packaging", v)} 
                />
              </>
            )}

            {visitorType === "Researcher / Student" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField label="Institution Name" value={categoryData["Institution Name"] || ""} onChange={(v: string) => handleCategoryChange("Institution Name", v)} />
                  <InputField label="Roll Number or Student / Faculty ID" value={categoryData["ID Number"] || ""} onChange={(v: string) => handleCategoryChange("ID Number", v)} />
                  <InputField label="Guide or Head of Department Name" value={categoryData["HOD Name"] || ""} onChange={(v: string) => handleCategoryChange("HOD Name", v)} />
                </div>
                <RadioGroup 
                  label="Course" 
                  options={["BAMS", "MD", "PhD", "Other"]} 
                  value={categoryData["Course"] || ""} 
                  onChange={(v) => handleCategoryChange("Course", v)} 
                />
                <RadioGroup 
                  label="Nature of Inquiry" 
                  options={["Internship", "Industrial Visit", "Research Material", "Reference Sample"]} 
                  value={categoryData["Nature of Inquiry"] || ""} 
                  onChange={(v) => handleCategoryChange("Nature of Inquiry", v)} 
                />
              </>
            )}

            {visitorType === "End Consumer / Patient" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField label="Age" type="number" value={categoryData["Age"] || ""} onChange={(v: string) => handleCategoryChange("Age", v)} />
                  <InputField label="Product Enquired About" value={categoryData["Product"] || ""} onChange={(v: string) => handleCategoryChange("Product", v)} />
                </div>
                <RadioGroup 
                  label="Gender" 
                  options={["Male", "Female", "Prefer not to say"]} 
                  value={categoryData["Gender"] || ""} 
                  onChange={(v) => handleCategoryChange("Gender", v)} 
                />
                <RadioGroup 
                  label="Source of Reference" 
                  options={["Doctor", "Online", "Retail Store", "Other"]} 
                  value={categoryData["Reference Source"] || ""} 
                  onChange={(v) => handleCategoryChange("Reference Source", v)} 
                />
                <RadioGroup 
                  label="Question Type" 
                  options={["Availability", "Usage", "Authenticity", "Side-effects"]} 
                  value={categoryData["Question Type"] || ""} 
                  onChange={(v) => handleCategoryChange("Question Type", v)} 
                />
              </>
            )}

            <div className="pt-2">
              <TextAreaField label="Message / Specific Requirement" required value={common.message} onChange={(v: string) => setCommon({...common, message: v})} placeholder="Please describe your requirements in detail..." />
            </div>
            
            {/* Honeypot Field */}
            <input type="text" name="hp_field" className="hidden" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
          </div>

          <hr className="border-[#A69279]/20" />

          {/* ── Consent & Submit ── */}
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${consent ? 'border-[#A57051] bg-[#A57051]' : 'border-[#A57051]/40 bg-[#F2EDE4]/30 group-hover:border-[#A57051]/80'}`}>
                  {consent && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm text-[#6B4A35]">I agree to be contacted by Gandhi Brothers regarding my inquiry. <span className="text-[#A57051]">*</span></span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${marketingOptIn ? 'border-[#A57051] bg-[#A57051]' : 'border-[#A57051]/40 bg-[#F2EDE4]/30 group-hover:border-[#A57051]/80'}`}>
                  {marketingOptIn && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm text-[#6B4A35]">Subscribe me to product updates, new launches, and catalogue releases. (Optional)</span>
              </label>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200">
                {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#A57051] hover:bg-[#A57051]/90 focus:ring-4 focus:ring-[#A57051]/20 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Inquiry"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
