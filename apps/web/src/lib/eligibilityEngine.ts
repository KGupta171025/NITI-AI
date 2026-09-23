import { EntrepreneurProfile, SchemeDetail, SchemeMatchResult } from "@niti-ai/types";
import { SCHEMES_DATABASE } from "@/lib/schemesData";

/**
 * Deterministic Rule-Based Eligibility & Recommendation Scoring Engine
 * Analyzes profile parameters against government scheme criteria.
 */
export function evaluateSchemeEligibility(
  profile: Partial<EntrepreneurProfile>,
  scheme: SchemeDetail
): SchemeMatchResult {
  const matchReasons: string[] = [];
  const disqualificationReasons: string[] = [];
  let score = 0;

  const criteria = scheme.eligibilityCriteria;

  // 1. Age Verification
  const userAge = profile.age || 28;
  if (criteria.minAge && userAge < criteria.minAge) {
    disqualificationReasons.push(`Age (${userAge}) is below scheme minimum requirement of ${criteria.minAge} years.`);
  } else if (criteria.maxAge && userAge > criteria.maxAge) {
    disqualificationReasons.push(`Age (${userAge}) exceeds scheme maximum limit of ${criteria.maxAge} years.`);
  } else {
    score += 15;
    matchReasons.push(`Meets age eligibility (${userAge} years).`);
  }

  // 2. Gender Targeting
  const userGender = profile.gender || "prefer_not_to_say";
  if (criteria.genderAllowed && !criteria.genderAllowed.includes("all")) {
    if (criteria.genderAllowed.includes(userGender as "female" | "male" | "transgender")) {
      score += 25;
      matchReasons.push(`Qualifies for affirmative scheme priority for ${userGender} entrepreneurs.`);
    } else {
      disqualificationReasons.push(`Exclusively restricted to: ${criteria.genderAllowed.join(", ")}.`);
    }
  } else {
    score += 15;
  }

  // 3. Social Category Check
  const userCategory = profile.socialCategory || "general";
  if (criteria.socialCategoriesAllowed && !criteria.socialCategoriesAllowed.includes("all")) {
    if (criteria.socialCategoriesAllowed.includes(userCategory)) {
      score += 20;
      matchReasons.push(`Special social category subsidy active for ${userCategory.toUpperCase()} founders.`);
    } else {
      disqualificationReasons.push(`Restricted to categories: ${criteria.socialCategoriesAllowed.join(", ")}.`);
    }
  } else {
    score += 15;
  }

  // 4. Enterprise Stage
  const userStage = profile.businessStage || "starting";
  if (criteria.allowedBusinessStages && !criteria.allowedBusinessStages.includes("all")) {
    if (criteria.allowedBusinessStages.includes(userStage)) {
      score += 20;
      matchReasons.push(`Business stage '${userStage}' aligns with supported project phase.`);
    } else {
      disqualificationReasons.push(`Applicable for ${criteria.allowedBusinessStages.join(", ")} stage only.`);
    }
  } else {
    score += 15;
  }

  // 5. Geographic Applicability
  const userState = profile.location?.state;
  if (criteria.statesApplicable && !criteria.statesApplicable.includes("all")) {
    if (userState && criteria.statesApplicable.some((s) => s.toLowerCase() === userState.toLowerCase())) {
      score += 25;
      matchReasons.push(`Geographically applicable to unit location in ${userState}.`);
    } else {
      disqualificationReasons.push(`Available only for enterprises in: ${criteria.statesApplicable.join(", ")}.`);
    }
  } else {
    score += 15;
    matchReasons.push(`Nationwide scheme valid in all States & UTs.`);
  }

  // 6. Funding Alignment
  const userFunding = profile.fundingRequired || 500000;
  if (scheme.fundingRange) {
    if (userFunding >= scheme.fundingRange.min && userFunding <= scheme.fundingRange.max) {
      score += 15;
      matchReasons.push(`Requested funding (₹${userFunding.toLocaleString("en-IN")}) falls within scheme range.`);
    } else if (userFunding > scheme.fundingRange.max) {
      matchReasons.push(`Requested funding exceeds scheme cap of ₹${scheme.fundingRange.max.toLocaleString("en-IN")}.`);
    }
  }

  const isEligible = disqualificationReasons.length === 0;
  const normalizedScore = isEligible ? Math.min(Math.round((score / 105) * 100), 100) : Math.max(score - 40, 20);

  return {
    scheme,
    matchScore: normalizedScore,
    isEligible,
    matchReasons,
    disqualificationReasons
  };
}

/**
 * Rank Schemes for Given Profile
 */
export function getRecommendedSchemes(profile: Partial<EntrepreneurProfile>): SchemeMatchResult[] {
  return SCHEMES_DATABASE.map((scheme) => evaluateSchemeEligibility(profile, scheme)).sort(
    (a, b) => b.matchScore - a.matchScore
  );
}
