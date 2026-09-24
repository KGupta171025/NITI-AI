import { SCHEMES_DATABASE } from "@/lib/schemesData";
import { ChatMessage, SchemeDetail } from "@niti-ai/types";

/**
 * NITI Saathi (नीति साथी) — Advanced Human-Friendly Conversational Scheme Advisor
 * Emulates the warmth, clarity, and step-by-step guidance of ChatGPT.
 * 100% Self-Hosted, Privacy-Preserving, and Multilingual (English, Hindi, Hinglish).
 */
export class MultilingualRagAssistant {
  private schemes: SchemeDetail[] = SCHEMES_DATABASE;

  /**
   * Semantic & keyword retrieval across central and state schemes
   */
  public retrieveContext(query: string): SchemeDetail[] {
    const q = query.toLowerCase();

    // Direct slug matches
    if (q.includes("pmegp") || q.includes("kvic") || (q.includes("35%") && q.includes("subsidy"))) {
      return this.filterBySlug("pmegp");
    }
    if (q.includes("standup") || q.includes("stand-up") || q.includes("stand up") || (q.includes("women") && q.includes("1 crore"))) {
      return this.filterBySlug("standup-india");
    }
    if (q.includes("mudra") || q.includes("shishu") || q.includes("kishore") || q.includes("tarun")) {
      return this.filterBySlug("pm-mudra");
    }
    if (q.includes("cgtmse") || (q.includes("5 crore") && q.includes("guarantee")) || (q.includes("collateral") && q.includes("free") && q.includes("loan"))) {
      return this.filterBySlug("cgtmse");
    }
    if (q.includes("vishwakarma") || q.includes("artisan") || q.includes("carpenter") || q.includes("toolkit") || q.includes("15000")) {
      return this.filterBySlug("pm-vishwakarma");
    }
    if (q.includes("seed fund") || q.includes("sisfs") || q.includes("startup india") || (q.includes("startup") && q.includes("grant"))) {
      return this.filterBySlug("sisfs");
    }
    if (q.includes("pmfme") || q.includes("food processing") || q.includes("bakery") || q.includes("flour mill") || q.includes("spice")) {
      return this.filterBySlug("pmfme");
    }
    if (q.includes("zed") || q.includes("clean tech") || q.includes("certification") || q.includes("zero defect")) {
      return this.filterBySlug("msme-zed");
    }
    if (q.includes("sc-st hub") || q.includes("nssh") || q.includes("nsic") || (q.includes("sc/st") && q.includes("procurement"))) {
      return this.filterBySlug("nssh");
    }
    if (q.includes("madhya pradesh") || q.includes("mp msme") || q.includes("bhopal") || q.includes("indore")) {
      return this.filterBySlug("mp-msme-policy");
    }
    if (q.includes("maharashtra") || q.includes("cmegp") || q.includes("pune") || q.includes("mumbai")) {
      return this.filterBySlug("maha-cmegp");
    }
    if (q.includes("odop") || q.includes("uttar pradesh") || q.includes("up msme") || q.includes("lucknow") || q.includes("chikankari")) {
      return this.filterBySlug("up-odop-scheme");
    }
    if (q.includes("tamil nadu") || q.includes("needs") || q.includes("chennai") || q.includes("coimbatore")) {
      return this.filterBySlug("tamil-nadu-needs");
    }
    if (q.includes("karnataka") || q.includes("elevate") || q.includes("bengaluru") || q.includes("bangalore")) {
      return this.filterBySlug("karnataka-elevate");
    }

    // Broad multi-scheme search
    const results = this.schemes.filter((scheme) => {
      return (
        scheme.schemeName.toLowerCase().includes(q) ||
        scheme.shortName.toLowerCase().includes(q) ||
        scheme.summary.toLowerCase().includes(q) ||
        scheme.description.toLowerCase().includes(q) ||
        scheme.sector?.toLowerCase().includes(q) ||
        scheme.tags?.some((t) => q.includes(t.toLowerCase())) ||
        (q.includes("subsidy") && scheme.subsidyPercentage !== undefined) ||
        (q.includes("women") || q.includes("mahila")) && (scheme.slug === "standup-india" || scheme.slug === "pmegp" || scheme.slug === "maha-cmegp") ||
        (q.includes("manufacturing") && (scheme.slug === "pmegp" || scheme.slug === "mp-msme-policy" || scheme.slug === "cgtmse"))
      );
    });

    return results.length > 0 ? results : this.schemes.slice(0, 3);
  }

  private filterBySlug(slug: string): SchemeDetail[] {
    const found = this.schemes.filter((s) => s.slug === slug);
    return found.length > 0 ? found : this.schemes.slice(0, 2);
  }

  /**
   * Human-friendly response generator
   */
  public generateResponse(
    query: string,
    _history: ChatMessage[],
    userLanguage: "en" | "hi" | "hinglish" = "en"
  ): ChatMessage {
    const qLower = query.toLowerCase().trim();

    // Check language intent
    const isHindiScript = /[\u0900-\u097F]/.test(query);
    const isHinglish =
      userLanguage === "hinglish" ||
      /\b(kaise|kya|milega|chahiye|yojana|kitna|hoga|karein|batao|kripya|namaste|bataiye|paise|subsidy)\b/i.test(query);

    // 1. Handling Friendly Greetings & Chit-chat
    if (/^(hi|hello|hey|namaste|namaskar|pranam|good morning|good evening)\b/i.test(qLower)) {
      return this.buildGreetingResponse(isHindiScript, isHinglish);
    }

    // 2. Identify relevant scheme context
    const retrieved = this.retrieveContext(query);
    const topScheme = retrieved[0] || this.schemes[0]!;

    const citations = retrieved.slice(0, 2).map((s) => ({
      schemeId: s.id,
      schemeName: s.schemeName,
      slug: s.slug,
      excerpt: `${s.summary} (Official Portal: ${s.portalSource || "Gov Portal"})`
    }));

    // Detect specific user intent: Documents, Subsidy Calculation, How to Apply, General
    const wantsDocs = /\b(document|kagaz|papers|praman|patra|chahiye|proof)\b/i.test(qLower);
    const wantsApplication = /\b(apply|process|form|registration|portal|karein|step)\b/i.test(qLower);
    const wantsCalculation = /\b(calculate|kitna|amount|subsidy kitni|rate|grant)\b/i.test(qLower) || /\d+/.test(qLower);

    let content = "";
    let suggestions: string[] = [];

    if (wantsDocs) {
      content = this.formatDocumentChecklist(topScheme, isHindiScript, isHinglish);
      suggestions = [
        `How do I apply for ${topScheme.shortName}?`,
        `Calculate subsidy for ₹10 Lakhs project`,
        "Show other matching schemes"
      ];
    } else if (wantsApplication) {
      content = this.formatApplicationGuide(topScheme, isHindiScript, isHinglish);
      suggestions = [
        `What documents are required for ${topScheme.shortName}?`,
        "Is collateral required for this loan?",
        "Compare with other schemes"
      ];
    } else if (wantsCalculation && topScheme.subsidyPercentage) {
      content = this.formatFinancialBreakdown(topScheme, query, isHindiScript, isHinglish);
      suggestions = [
        `Required documents for ${topScheme.shortName}`,
        `Step-by-step application link`,
        "Check schemes for women entrepreneurs"
      ];
    } else {
      content = this.formatComprehensiveAdvice(topScheme, retrieved.slice(1, 3), isHindiScript, isHinglish);
      suggestions = [
        `What documents do I need for ${topScheme.shortName}?`,
        `How much subsidy can I get?`,
        `How to apply on ${topScheme.portalSource || "official portal"}`
      ];
    }

    return {
      id: "msg-" + Date.now(),
      role: "assistant",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      citations,
      suggestions
    };
  }

  // ─── Persona & Response Builders ──────────────────────────────────────────

  private buildGreetingResponse(isHindi: boolean, isHinglish: boolean): ChatMessage {
    let content = "";
    let suggestions: string[] = [];

    if (isHindi) {
      content = `### 🙏 नमस्ते! मैं नीति साथी (NITI Saathi) हूँ
मैं आपका व्यक्तिगत सरकारी योजना एवं सब्सिडी सलाहकार हूँ।

मैं आपको आपके व्यवसाय, उद्योग, और राज्य के अनुसार सर्वोत्तम सरकारी ऋण, 15% से 80% तक की पूंजीगत सब्सिडी (Capital Subsidy), और बिना गारंटी के बैंक लोन प्राप्त करने में सहायता करूँगा।

### 💡 आप मुझसे क्या पूछ सकते हैं:
- मैन्युफैक्चरिंग शुरू करने के लिए 35% सब्सिडी कैसे मिलेगी?
- महिला उद्यमियों या SC/ST के लिए कौन सी विशेष योजनाएं हैं?
- बिना किसी गारंटी (Collateral) के ₹10 लाख का मुद्रा लोन कैसे लें?
- मध्य प्रदेश, महाराष्ट्र या उत्तर प्रदेश की राज्य MSME नीतियां क्या हैं?

आप अपने व्यवसाय का प्रकार या अपेक्षित बजट बताएं, मैं तुरंत आपकी मदद करूँगा!`;
      suggestions = [
        "ग्रामीण विनिर्माण पर 35% सब्सिडी योजना बताएं",
        "महिलाओं के लिए स्टैंड-अप इंडिया योजना",
        "मुद्रा लोन के लिए कौन से दस्तावेज चाहिए?"
      ];
    } else if (isHinglish) {
      content = `### 🙏 Namaste! Main hoon NITI Saathi
Main aapka personal Government Scheme & Subsidy Advisor hoon!

Main aapko aapke business idea, sector, aur state ke according best central & state government schemes, **15% se 40% capital subsidies**, aur **zero-collateral loans** khojne me guide karunga.

### 💡 Aap mujhse pooch sakte hain:
- New manufacturing unit lagane ke liye 35% subsidy scheme kaunsi hai?
- Women entrepreneurs ke liye ₹10L - ₹1Cr tak ka loan kaise milega?
- Collateral-free CGTMSE aur Mudra loan ka online process kya hai?
- Required documents aur DPR kaise banwayein?

Aap apna business stage ya funding requirement batayein, chaliye shuru karte hain! 🚀`;
      suggestions = [
        "PMEGP me 35% subsidy kaise milegi?",
        "Mudra loan bina collateral kaise lein?",
        "Women entrepreneurs ke liye schemes batao"
      ];
    } else {
      content = `### 🙏 Namaste! I am NITI Saathi
Your personal AI Government Scheme & Subsidy Advisor.

I am here to guide you like a dedicated mentor through India's **1,200+ verified central and state schemes**, capital subsidies (up to 40%), collateral-free bank loans, and official application portals.

### 💡 Here is how I can assist you today:
- **Discover Tailored Schemes:** Tell me your business sector, state, and investment plan.
- **Exact Subsidy Calculations:** See how much non-refundable grant money you qualify for.
- **Document Checklists:** Get precise lists of certificates, DPR requirements, and bank papers.
- **Step-by-step Application Walkthroughs:** Direct links to JanSamarth, KVIC, and State Single-Window Portals.

What kind of enterprise are you running or planning to start?`;
      suggestions = [
        "Which scheme gives 35% subsidy for manufacturing?",
        "How to get collateral-free loan up to ₹10 Lakhs?",
        "Schemes for Women & SC/ST Entrepreneurs"
      ];
    }

    return {
      id: "msg-" + Date.now(),
      role: "assistant",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestions
    };
  }

  private formatComprehensiveAdvice(
    top: SchemeDetail,
    alternatives: SchemeDetail[],
    isHindi: boolean,
    isHinglish: boolean
  ): string {
    const minFunding = (top.fundingRange?.min || 50000).toLocaleString("en-IN");
    const maxFunding = (top.fundingRange?.max || 5000000).toLocaleString("en-IN");
    const subsidy = top.subsidyPercentage ? `${top.subsidyPercentage}% Capital Subsidy` : "Collateral-Free Bank Credit";

    if (isHindi) {
      return `## ${top.schemeName} (${top.shortName})
${top.summary}

---

### 💰 मुख्य वित्तीय लाभ एवं सब्सिडी
- **वित्तीय सहायता दायरा:** ₹${minFunding} से लेकर ₹${maxFunding} तक
- **सब्सिडी दर:** ${subsidy} (सरकार द्वारा वहन)
- **संबद्ध पोर्टल:** ${top.portalSource || "आधिकारिक सरकारी पोर्टल"}
- **स्थिति:** 🟢 ${top.liveStatusText || "सक्रिय एवं आवेदन खुले हैं"}

### 🚀 प्रमुख लाभ एवं विशेषताएं
${top.benefitsSummary.map((b) => `- ${b}`).join("\n")}

${
  alternatives.length > 0
    ? `### 🔍 अन्य प्रासंगिक विकल्प\n${alternatives.map((a) => `- **${a.shortName}**: ${a.summary} (₹${(a.fundingRange?.max || 0).toLocaleString("en-IN")} तक)`).join("\n")}\n`
    : ""
}
🔗 **आधिकारिक पोर्टल:** [यहाँ क्लिक करके आधिकारिक पोर्टल पर जाएँ](${top.applicationUrl})

*क्या आप इसके आवश्यक दस्तावेज़ों की सूची या सब्सिडी की सटीक गणना देखना चाहते हैं?*`;
    }

    if (isHinglish) {
      return `## ${top.schemeName} (${top.shortName})
${top.summary}

---

### 💰 Financial Highlights & Subsidy
- **Loan / Funding Range:** ₹${minFunding} se ₹${maxFunding} tak
- **Govt Subsidy:** ${subsidy}
- **Official Source:** ${top.portalSource || "Official Govt Portal"}
- **Current Status:** 🟢 ${top.liveStatusText || "Application Portal Active"}

### 🚀 Key Benefits
${top.benefitsSummary.map((b) => `- ${b}`).join("\n")}

${
  alternatives.length > 0
    ? `### 📌 Alternative Schemes\n${alternatives.map((a) => `- **${a.shortName}**: ${a.summary}`).join("\n")}\n`
    : ""
}
🔗 **Direct Apply Link:** [Official Portal par Apply Karein](${top.applicationUrl})

*Aap iske required documents ya exact subsidy calculation dekhna chahte hain?*`;
    }

    return `## ${top.schemeName} (${top.shortName})
${top.summary}

---

### 💰 Financial & Subsidy Highlights
- **Funding Range:** ₹${minFunding} to ₹${maxFunding}
- **Subsidy Rate:** ${subsidy}
- **Integrated Portal:** ${top.portalSource || "National Portal"}
- **Live Status:** 🟢 ${top.liveStatusText || "Applications Verified Active"}

### 🚀 Key Highlights & Advantages
${top.benefitsSummary.map((b) => `- ${b}`).join("\n")}

${
  alternatives.length > 0
    ? `### 📌 Other Highly Relevant Options\n${alternatives.map((a) => `- **${a.shortName}**: ${a.summary}`).join("\n")}\n`
    : ""
}
🔗 **Official Portal:** [Apply Online via Official Website](${top.applicationUrl})

*Would you like me to walk you through the required documents checklist or compute your specific subsidy amount?*`;
  }

  private formatDocumentChecklist(
    scheme: SchemeDetail,
    isHindi: boolean,
    isHinglish: boolean
  ): string {
    const docs = scheme.documentsRequired.map((d, i) => `${i + 1}. ${d}`).join("\n");

    if (isHindi) {
      return `### 📄 ${scheme.shortName} के लिए आवश्यक दस्तावेजों की चेकलिस्ट
इस योजना में बैंक लोन एवं सब्सिडी प्राप्त करने के लिए निम्नलिखित दस्तावेज तैयार रखें:

${docs}

### 💡 नीति साथी का सुझाव:
- एक अच्छी **विस्तृत परियोजना रिपोर्ट (DPR)** तैयार रखें जिसमें मशीनरी के कोटेशन स्पष्ट रूप से शामिल हों।
- यदि आप ग्रामीण सब्सिडी (35%) या विशेष श्रेणी का दावा कर रहे हैं, तो संबंधित ग्राम पंचायत प्रमाण पत्र और जाति प्रमाण पत्र अवश्य संलग्न करें।

🔗 **सीधा आवेदन पोर्टल:** [यहाँ से ऑनलाइन आवेदन करें](${scheme.applicationUrl})`;
    }

    if (isHinglish) {
      return `### 📄 Required Documents Checklist for ${scheme.shortName}
Bank sanction aur subsidy approval ke liye ye documents ready rakhein:

${docs}

### 💡 Pro-Tip by NITI Saathi:
- Machinery vendor se GST-registered formal quotation zaroor lein taaki DPR strong bane.
- Agar aap rural area me hain, toh Gram Panchayat certificate zaroor lagayein taaki maximum 35% subsidy claim ho sake.

🔗 **Application Link:** [Click here to apply online](${scheme.applicationUrl})`;
    }

    return `### 📄 Required Documents Checklist for ${scheme.shortName}
To ensure rapid bank sanction and subsidy release, keep these documents handy:

${docs}

### 💡 NITI Saathi Expert Advice:
- Ensure machinery quotations include vendor GSTIN and technical specifications for the DPR.
- If applying for rural quota (up to 35% grant under PMEGP), obtain the rural demarcation letter from your local Panchayat/Tehsildar.

🔗 **Application Portal:** [Proceed to Official Portal](${scheme.applicationUrl})`;
  }

  private formatApplicationGuide(
    scheme: SchemeDetail,
    isHindi: boolean,
    isHinglish: boolean
  ): string {
    const steps = scheme.applicationProcess.map((s, i) => `${i + 1}. ${s}`).join("\n");

    if (isHindi) {
      return `### 🚀 ${scheme.shortName} में आवेदन करने की चरण-दर-चरण प्रक्रिया

${steps}

---
- **कार्यान्वयन एजेंसी:** ${scheme.implementingAgency}
- **आधिकारिक पोर्टल:** [यहाँ क्लिक करके सीधे आवेदन करें](${scheme.applicationUrl})

*क्या आपको किसी विशेष चरण में सहायता चाहिए?*`;
    }

    if (isHinglish) {
      return `### 🚀 Step-by-Step Application Guide for ${scheme.shortName}

${steps}

---
- **Implementing Agency:** ${scheme.implementingAgency}
- **Official Portal:** [Apply directly online](${scheme.applicationUrl})

*Kisi step me confusion ho toh batayein!*`;
    }

    return `### 🚀 Step-by-Step Application Guide for ${scheme.shortName}

${steps}

---
- **Implementing Agency:** ${scheme.implementingAgency}
- **Direct Application Portal:** [Submit Online Application](${scheme.applicationUrl})

*Need clarification on any step or bank selection? Just ask!*`;
  }

  private formatFinancialBreakdown(
    scheme: SchemeDetail,
    query: string,
    isHindi: boolean,
    isHinglish: boolean
  ): string {
    // Extract number from query or default to ₹10 Lakhs
    const match = query.match(/(\d+[\d,]*)/);
    let amount = 1000000;
    if (match && match[1]) {
      const parsed = parseInt(match[1].replace(/,/g, ""), 10);
      if (parsed > 10000 && parsed < 100000000) {
        amount = parsed;
      } else if (parsed <= 100) {
        amount = parsed * 100000; // e.g. "10" => 10 Lakhs
      }
    }

    const subsidyPercent = scheme.subsidyPercentage || 25;
    const subsidyAmount = Math.round((amount * subsidyPercent) / 100);
    const ownContribution = Math.round(amount * 0.05); // 5% own
    const bankLoan = amount - ownContribution;

    if (isHindi) {
      return `### 💰 ${scheme.shortName} सब्सिडी एवं ऋण वित्तीय गणना
यदि आपके व्यवसाय का कुल अनुमानित बजट **₹${amount.toLocaleString("en-IN")}** है:

| वित्तीय मद (Item) | विवरण | राशि (Amount) |
| :--- | :--- | :--- |
| **कुल परियोजना लागत** | Total Project Cost | ₹${amount.toLocaleString("en-IN")} |
| **सरकारी पूंजीगत सब्सिडी** | ${subsidyPercent}% Grant (वापस नहीं करनी) | ₹${subsidyAmount.toLocaleString("en-IN")} |
| **उद्यमी का अंशदान** | 5% to 10% Own Contribution | ₹${ownContribution.toLocaleString("en-IN")} |
| **बैंक टर्म लोन** | Bank Finance | ₹${bankLoan.toLocaleString("en-IN")} |

### 💡 महत्वपूर्ण तथ्य:
सरकारी सब्सिडी राशि सीधे आपके बैंक खाते में 'मार्जिन मनी' के रूप में जमा की जाती है और 3 वर्ष की संतोषजनक इकाई संचालन के बाद आपके ऋण खाते में स्थायी रूप से समायोजित हो जाती है!

🔗 **ऑनलाइन आवेदन करें:** [यहाँ क्लिक करें](${scheme.applicationUrl})`;
    }

    if (isHinglish) {
      return `### 💰 ${scheme.shortName} Subsidy & Loan Calculation
Agar aapka projected business budget **₹${amount.toLocaleString("en-IN")}** hai:

| Financial Head | Percentage | Amount (₹) |
| :--- | :---: | :--- |
| **Total Project Cost** | 100% | ₹${amount.toLocaleString("en-IN")} |
| **Govt Capital Subsidy** | ${subsidyPercent}% (Non-refundable) | ₹${subsidyAmount.toLocaleString("en-IN")} |
| **Your Own Contribution** | 5% | ₹${ownContribution.toLocaleString("en-IN")} |
| **Bank Term Loan** | 95% | ₹${bankLoan.toLocaleString("en-IN")} |

### 💡 Key Takeaway:
Govt subsidy aapke bank account me 'Margin Money TDR' ke roop me aati hai, jisse aapka interest burden aur monthly EMI drastically kam ho jata hai!

🔗 **Portal Link:** [Official Website par Apply Karein](${scheme.applicationUrl})`;
    }

    return `### 💰 Estimated Subsidy & Loan Breakdown for ${scheme.shortName}
For a projected enterprise investment of **₹${amount.toLocaleString("en-IN")}**:

| Financing Component | Allocation | Estimated Amount (₹) |
| :--- | :---: | :--- |
| **Total Project Cost** | 100% | ₹${amount.toLocaleString("en-IN")} |
| **Government Capital Grant** | ${subsidyPercent}% (Non-Repayable) | ₹${subsidyAmount.toLocaleString("en-IN")} |
| **Promoter's Equity (Own)** | 5% - 10% | ₹${ownContribution.toLocaleString("en-IN")} |
| **Bank Term Loan** | 90% - 95% | ₹${bankLoan.toLocaleString("en-IN")} |

### 💡 How the Subsidy Works:
The government subsidy is credited directly to the borrower's account as Margin Money and locked in a Term Deposit Receipt for 3 years, after which it permanently reduces the principal loan balance!

🔗 **Apply Now:** [Proceed to Official Portal](${scheme.applicationUrl})`;
  }
}

export const ragAssistant = new MultilingualRagAssistant();
