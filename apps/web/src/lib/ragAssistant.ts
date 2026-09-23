import { SCHEMES_DATABASE } from "@/lib/schemesData";
import { ChatMessage, SchemeDetail } from "@niti-ai/types";

/**
 * Self-Hosted Multilingual RAG Assistant Engine
 * Supports English, Hindi, and Hinglish with zero commercial API calls.
 */
export class MultilingualRagAssistant {
  private schemes: SchemeDetail[] = SCHEMES_DATABASE;

  /**
   * Search relevant schemes based on semantic keywords
   */
  public retrieveContext(query: string): SchemeDetail[] {
    const q = query.toLowerCase();

    return this.schemes.filter((scheme) => {
      return (
        scheme.schemeName.toLowerCase().includes(q) ||
        scheme.shortName.toLowerCase().includes(q) ||
        scheme.summary.toLowerCase().includes(q) ||
        scheme.description.toLowerCase().includes(q) ||
        scheme.ministry.toLowerCase().includes(q) ||
        (q.includes("loan") && scheme.fundingRange !== undefined) ||
        (q.includes("subsidy") && scheme.subsidyPercentage !== undefined) ||
        (q.includes("woman") || q.includes("mahila") || q.includes("women")) && scheme.slug === "standup-india" ||
        (q.includes("madhya pradesh") || q.includes("bhopal") || q.includes("indore") || q.includes("mp")) && scheme.slug === "mp-msme-policy" ||
        (q.includes("collateral") || q.includes("guarantee")) && scheme.slug === "cgtmse" ||
        (q.includes("mudra") || q.includes("shishu") || q.includes("kishore") || q.includes("tarun")) && scheme.slug === "pmmy-mudra" ||
        (q.includes("manufacturing") || q.includes("pmegp") || q.includes("kvic")) && scheme.slug === "pmegp"
      );
    });
  }

  /**
   * Generate Grounded Multilingual Response
   */
  public generateResponse(
    query: string,
    _history: ChatMessage[],
    userLanguage: "en" | "hi" | "hinglish" = "en"
  ): ChatMessage {
    const retrieved = this.retrieveContext(query);
    const citations = retrieved.slice(0, 2).map((s) => ({
      schemeId: s.id,
      schemeName: s.schemeName,
      slug: s.slug,
      excerpt: s.summary
    }));

    // Detect language intent from query if mixed
    const isHindiScript = /[\u0900-\u097F]/.test(query);
    const isHinglish =
      userLanguage === "hinglish" ||
      /\b(kaise|kya|milega|chahiye|yojana|kitna|hoga|karein|loan|subsidy|batao)\b/i.test(query);

    let content = "";

    if (retrieved.length === 0) {
      if (isHindiScript) {
        content =
          "मुझे आपके प्रश्न के लिए कोई सीधा सरकारी योजना रिकॉर्ड नहीं मिला। कृपया अपने व्यवसाय का प्रकार, अपेक्षित ऋण राशि या राज्य का नाम निर्दिष्ट करें।";
      } else if (isHinglish) {
        content =
          "Aapke query ke liye koi direct scheme record nahi mila. Kripya apna business stage, required loan amount ya State name specify karein taaki exact scheme match ki ja sake.";
      } else {
        content =
          "I could not locate an exact government scheme match for your query. Please specify your business sector, required funding amount, or state location.";
      }
    } else {
      const topScheme = retrieved[0]!;

      if (isHindiScript) {
        content = `**${topScheme.schemeName} (${topScheme.shortName})** आपके लिए अत्यधिक प्रासंगिक है।\n\n- **मुख्य लाभ:** ${topScheme.benefitsSummary[0]}\n- **वित्तीय सहायता:** ${
          topScheme.subsidyPercentage ? `अधिकतम ${topScheme.subsidyPercentage}% सब्सिडी` : "संपार्श्विक-मुक्त (Collateral-Free) बैंक ऋण"
        }\n- **आधिकारिक स्रोत:** [यहाँ आवेदन करें](${topScheme.applicationUrl})\n\nक्या आप इसके लिए आवश्यक दस्तावेजों की सूची देखना चाहते हैं?`;
      } else if (isHinglish) {
        content = `Aapke business ke liye **${topScheme.schemeName} (${topScheme.shortName})** sabse best match hai.\n\n- **Key Benefit:** ${topScheme.benefitsSummary[0]}\n- **Funding Amount:** ₹${(
          topScheme.fundingRange?.min || 0
        ).toLocaleString("en-IN")} se ₹${(topScheme.fundingRange?.max || 0).toLocaleString(
          "en-IN"
        )} tak available hai.\n- **Application Portal:** [Online Apply Karein](${topScheme.applicationUrl})\n\nKya aap eligibility checklist aur required documents check karna chahte hain?`;
      } else {
        content = `Based on verified government guidelines, **${topScheme.schemeName} (${topScheme.shortName})** directly matches your criteria.\n\n- **Key Benefit:** ${topScheme.benefitsSummary[0]}\n- **Funding Limits:** Up to ₹${(
          topScheme.fundingRange?.max || 0
        ).toLocaleString("en-IN")}\n- **Implementing Authority:** ${topScheme.implementingAgency}\n- **Official Portal:** [Apply on Official Website](${topScheme.applicationUrl})\n\nWould you like me to verify your specific eligibility checklist or document requirements?`;
      }
    }

    return {
      id: "msg-" + Date.now(),
      role: "assistant",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      citations
    };
  }
}

export const ragAssistant = new MultilingualRagAssistant();
