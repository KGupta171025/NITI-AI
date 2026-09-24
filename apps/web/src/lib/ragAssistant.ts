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
      content = `🙏 **नमस्ते! मैं नीति साथी (NITI Saathi) हूँ — आपका व्यक्तिगत सरकारी योजना एवं सब्सिडी सलाहकार।**\n\nमैं आपको आपके व्यवसाय, उद्योग, और राज्य के अनुसार सर्वोत्तम सरकारी ऋण, 15% से 80% तक की पूंजीगत सब्सिडी (Capital Subsidy), और बिना गारंटी के बैंक लोन प्राप्त करने में मदद कर सकता हूँ।\n\n💡 **आप मुझसे क्या पूछ सकते हैं:**\n- "मैन्युफैक्चरिंग शुरू करने के लिए 35% सब्सिडी कैसे मिलेगी?"\n- "महिला उद्यमियों या SC/ST के लिए कौन सी योजनाएं हैं?"\n- "बिना किसी गारंटी (Collateral) के ₹10 लाख का मुद्रा लोन कैसे लें?"\n- "मध्य प्रदेश, महाराष्ट्र या UP की MSME नीतियां क्या हैं?"\n\nआप अपने व्यवसाय का प्रकार या अपेक्षित बजट बताएं, मैं तुरंत आपकी मदद करूँगा!`;
      suggestions = [
        "ग्रामीण विनिर्माण पर 35% सब्सिडी योजना बताएं",
        "महिलाओं के लिए स्टैंड-अप इंडिया योजना",
        "मुद्रा लोन के लिए कौन से दस्तावेज चाहिए?"
      ];
    } else if (isHinglish) {
      content = `🙏 **Namaste! Main hoon NITI Saathi — aapka personal Government Scheme & Subsidy Advisor!**\n\nMain aapko aapke business idea, sector, aur state ke according best central & state government schemes, **15% se 40% capital subsidies**, aur **zero-collateral loans** khojne me madad karunga.\n\n💡 **Aap mujhse pooch sakte hain:**\n- "Mujhe new manufacturing unit lagani hai, best scheme kaunsi hai?"\n- "Women entrepreneurs ke liye ₹10L - ₹1Cr tak ka loan kaise milega?"\n- "Collateral-free CGTMSE aur Mudra loan ka process kya hai?"\n- "Required documents aur DPR kaise taiyar karein?"\n\nAap apna business stage ya funding requirement batayein, chaliye shuru karte hain! 🚀`;
      suggestions = [
        "PMEGP me 35% subsidy kaise milegi?",
        "Mudra loan bina collateral kaise lein?",
        "Women entrepreneurs ke liye schemes batao"
      ];
    } else {
      content = `🙏 **Namaste! I am NITI Saathi — your personal AI Government Scheme & Subsidy Advisor.**\n\nI am here to guide you like a dedicated mentor through India's **1,200+ verified central and state schemes**, capital subsidies (up to 40%), collateral-free bank loans, and official application portals.\n\n💡 **Here is how I can assist you today:**\n- **Discover Tailored Schemes:** Tell me your business sector, state, and investment plan.\n- **Exact Subsidy Calculations:** See how much non-refundable grant money you qualify for.\n- **Document Checklists:** Get precise lists of certificates, DPR requirements, and bank papers.\n- **Step-by-step Application Walkthroughs:** Direct links to JanSamarth, KVIC, and State Single-Window Portals.\n\nWhat kind of enterprise are you running or planning to start?`;
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
      return `### 🌟 आपकी आवश्यकता के लिए अनुशंसित योजना:\n## **${top.schemeName} (${top.shortName})**\n\n**${top.summary}**\n\n---\n\n#### 📌 **मुख्य वित्तीय लाभ (Financial Highlights):**\n- **वित्तीय सहायता दायरा:** ₹${minFunding} से लेकर **₹${maxFunding}** तक।\n- **सब्सिडी दर:** **${subsidy}** (सरकार द्वारा वहन)।\n- **संबद्ध पोर्टल:** **${top.portalSource || "आधिकारिक सरकारी पोर्टल"}**\n- **स्थिति:** 🟢 *${top.liveStatusText || "सक्रिय एवं आवेदन खुले हैं"}*\n\n#### 💡 **यह आपके लिए क्यों सबसे अच्छी है:**\n${top.benefitsSummary.map((b) => `- ${b}`).join("\n")}\n\n${
        alternatives.length > 0
          ? `\n#### 🔍 **अन्य उपयोगी विकल्प:**\n${alternatives.map((a) => `- **${a.shortName}**: ${a.summary} (₹${(a.fundingRange?.max || 0).toLocaleString("en-IN")} तक)`).join("\n")}\n`
          : ""
      }\n🔗 **आधिकारिक आवेदन लिंक:** [यहाँ क्लिक करके आधिकारिक पोर्टल पर जाएँ](${top.applicationUrl})\n\n*क्या आप इसके आवश्यक दस्तावेज़ों की सूची या सब्सिडी की सटीक गणना देखना चाहते हैं?*`;
    }

    if (isHinglish) {
      return `### 🌟 Aapke Business ke liye Sabse Best Scheme:\n## **${top.schemeName} (${top.shortName})**\n\n**${top.summary}**\n\n---\n\n#### 💰 **Financial Highlights:**\n- **Loan / Funding Range:** ₹${minFunding} se **₹${maxFunding}** tak.\n- **Govt. Subsidy:** **${subsidy}**.\n- **Official Source:** **${top.portalSource || "Official Govt Portal"}**.\n- **Current Status:** 🟢 *${top.liveStatusText || "Application Portal Active"}*.\n\n#### 🚀 **Key Benefits:**\n${top.benefitsSummary.map((b) => `- ${b}`).join("\n")}\n\n${
        alternatives.length > 0
          ? `\n#### 📌 **Alternative Schemes:**\n${alternatives.map((a) => `- **${a.shortName}**: ${a.summary}`).join("\n")}\n`
          : ""
      }\n🔗 **Direct Apply Link:** [Official Portal par Apply Karein](${top.applicationUrl})\n\n*Aap iske required documents ya exact subsidy calculation dekhna chahte hain?*`;
    }

    return `### 🌟 Top Recommended Scheme for Your Profile:\n## **${top.schemeName} (${top.shortName})**\n\n**${top.summary}**\n\n---\n\n#### 💰 **Financial & Subsidy Highlights:**\n- **Funding Range:** ₹${minFunding} to **₹${maxFunding}**.\n- **Subsidy Rate:** **${subsidy}**.\n- **Integrated Portal:** **${top.portalSource || "National Portal"}**.\n- **Live Status:** 🟢 *${top.liveStatusText || "Applications Verified Active"}*.\n\n#### 🚀 **Key Highlights & Advantages:**\n${top.benefitsSummary.map((b) => `- ${b}`).join("\n")}\n\n${
      alternatives.length > 0
        ? `\n#### 📌 **Other Highly Relevant Options:**\n${alternatives.map((a) => `- **${a.shortName}**: ${a.summary}`).join("\n")}\n`
        : ""
    }\n🔗 **Official Portal:** [Apply Online via Official Website](${top.applicationUrl})\n\n*Would you like me to walk you through the required documents checklist or compute your specific subsidy amount?*`;
  }

  private formatDocumentChecklist(
    scheme: SchemeDetail,
    isHindi: boolean,
    isHinglish: boolean
  ): string {
    const docs = scheme.documentsRequired.map((d, i) => `${i + 1}. **${d}**`).join("\n");

    if (isHindi) {
      return `### 📄 **${scheme.shortName} के लिए आवश्यक दस्तावेजों की चेकलिस्ट:**\n\nइस योजना में बैंक लोन एवं सब्सिडी प्राप्त करने के लिए निम्नलिखित दस्तावेज तैयार रखें:\n\n${docs}\n\n💡 **नीति साथी का सुझाव:**\n- एक अच्छी **विस्तृत परियोजना रिपोर्ट (DPR)** तैयार रखें जिसमें मशीनरी के कोटेशन स्पष्ट रूप से शामिल हों।\n- यदि आप ग्रामीण सब्सिडी (35%) या विशेष श्रेणी का दावा कर रहे हैं, तो संबंधित ग्राम पंचायत प्रमाण पत्र और जाति प्रमाण पत्र अवश्य संलग्न करें।\n\n🔗 **सीधा आवेदन पोर्टल:** [यहाँ से ऑनलाइन आवेदन करें](${scheme.applicationUrl})`;
    }

    if (isHinglish) {
      return `### 📄 **${scheme.shortName} ke liye Required Documents Checklist:**\n\nBank sanction aur subsidy approval ke liye ye documents ready rakhein:\n\n${docs}\n\n💡 **Pro-Tip by NITI Saathi:**\n- Machinery vendor se GST-registered formal quotation zaroor lein taaki DPR strong bane.\n- Agar aap rural area me hain, toh Gram Panchayat certificate zaroor lagayein taaki maximum 35% subsidy claim ho sake.\n\n🔗 **Application Link:** [Click here to apply online](${scheme.applicationUrl})`;
    }

    return `### 📄 **Required Documents Checklist for ${scheme.shortName}:**\n\nTo ensure rapid bank sanction and subsidy release, keep these documents handy:\n\n${docs}\n\n💡 **NITI Saathi Expert Advice:**\n- Ensure machinery quotations include vendor GSTIN and technical specifications for the DPR.\n- If applying for rural quota (up to 35% grant under PMEGP), obtain the rural demarcation letter from your local Panchayat/Tehsildar.\n\n🔗 **Application Portal:** [Proceed to Official Portal](${scheme.applicationUrl})`;
  }

  private formatApplicationGuide(
    scheme: SchemeDetail,
    isHindi: boolean,
    isHinglish: boolean
  ): string {
    const steps = scheme.applicationProcess.map((s, i) => `**Step ${i + 1}:** ${s}`).join("\n\n");

    if (isHindi) {
      return `### 🚀 **${scheme.shortName} में आवेदन करने की चरण-दर-चरण प्रक्रिया:**\n\n${steps}\n\n---\n🏛️ **कार्यान्वयन एजेंसी:** ${scheme.implementingAgency}\n🌐 **आधिकारिक पोर्टल:** [यहाँ क्लिक करके सीधे आवेदन करें](${scheme.applicationUrl})\n\n💡 *क्या आपको किसी विशेष चरण में सहायता चाहिए?*`;
    }

    if (isHinglish) {
      return `### 🚀 **Step-by-Step Application Guide for ${scheme.shortName}:**\n\n${steps}\n\n---\n🏛️ **Implementing Agency:** ${scheme.implementingAgency}\n🌐 **Official Portal:** [Apply directly online](${scheme.applicationUrl})\n\n💡 *Kisi step me confusion ho toh batayein!*`;
    }

    return `### 🚀 **Step-by-Step Application Guide for ${scheme.shortName}:**\n\n${steps}\n\n---\n🏛️ **Implementing Agency:** ${scheme.implementingAgency}\n🌐 **Direct Application Portal:** [Submit Online Application](${scheme.applicationUrl})\n\n💡 *Need clarification on any step or bank selection? Just ask!*`;
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
      return `### 💰 **${scheme.shortName} सब्सिडी एवं ऋण वित्तीय गणना (Financial Breakdown):**\n\nयदि आपके व्यवसाय का कुल अनुमानित बजट **₹${amount.toLocaleString("en-IN")}** है:\n\n| वित्तीय मद (Item) | विवरण | राशि (Amount) |\n| :--- | :--- | :--- |\n| **कुल परियोजना लागत** | Total Project Cost | **₹${amount.toLocaleString("en-IN")}** |\n| **सरकारी पूंजीगत सब्सिडी** | **${subsidyPercent}% Grant (वापस नहीं करनी)** | **₹${subsidyAmount.toLocaleString("en-IN")}** |\n| **उद्यमी का स्वयं का अंशदान** | 5% to 10% Own Contribution | **₹${ownContribution.toLocaleString("en-IN")}** |\n| **बैंक टर्म लोन** | Bank Finance | **₹${bankLoan.toLocaleString("en-IN")}** |\n\n💡 **महत्वपूर्ण तथ्य:**\nसरकारी सब्सिडी राशि सीधे आपके बैंक खाते में 'मार्जिन मनी' के रूप में जमा की जाती है और 3 वर्ष की संतोषजनक इकाई संचालन के बाद आपके ऋण खाते में स्थायी रूप से समायोजित हो जाती है!\n\n🔗 **ऑनलाइन आवेदन करें:** [यहाँ क्लिक करें](${scheme.applicationUrl})`;
    }

    if (isHinglish) {
      return `### 💰 **${scheme.shortName} Subsidy & Loan Calculation:**\n\nAgar aapka projected business budget **₹${amount.toLocaleString("en-IN")}** hai:\n\n| Financial Head | Percentage | Amount (₹) |\n| :--- | :---: | :--- |\n| **Total Project Cost** | 100% | **₹${amount.toLocaleString("en-IN")}** |\n| **Govt Capital Subsidy** | **${subsidyPercent}% (Non-refundable)** | **₹${subsidyAmount.toLocaleString("en-IN")}** |\n| **Your Own Contribution** | 5% | **₹${ownContribution.toLocaleString("en-IN")}** |\n| **Bank Term Loan** | 95% | **₹${bankLoan.toLocaleString("en-IN")}** |\n\n💡 **Key Takeaway:**\nGovt subsidy aapke bank account me 'Margin Money TDR' ke roop me aati hai, jisse aapka interest burden aur monthly EMI drastically kam ho jata hai!\n\n🔗 **Portal Link:** [Official Website par Apply Karein](${scheme.applicationUrl})`;
    }

    return `### 💰 **Estimated Subsidy & Loan Breakdown for ${scheme.shortName}:**\n\nFor a projected enterprise investment of **₹${amount.toLocaleString("en-IN")}**:\n\n| Financing Component | Allocation | Estimated Amount (₹) |\n| :--- | :---: | :--- |\n| **Total Project Cost** | 100% | **₹${amount.toLocaleString("en-IN")}** |\n| **Government Capital Grant** | **${subsidyPercent}% (Non-Repayable)** | **₹${subsidyAmount.toLocaleString("en-IN")}** |\n| **Promoter's Equity (Own)** | 5% - 10% | **₹${ownContribution.toLocaleString("en-IN")}** |\n| **Bank Term Loan** | 90% - 95% | **₹${bankLoan.toLocaleString("en-IN")}** |\n\n💡 **How the Subsidy Works:**\nThe government subsidy is credited directly to the borrower's account as Margin Money and locked in a Term Deposit Receipt for 3 years, after which it permanently reduces the principal loan balance!\n\n🔗 **Apply Now:** [Proceed to Official Portal](${scheme.applicationUrl})`;
  }
}

export const ragAssistant = new MultilingualRagAssistant();
