import { SchemeDetail } from "@niti-ai/types";

export const SCHEMES_DATABASE: SchemeDetail[] = [
  {
    id: "scheme-pmegp",
    schemeName: "Prime Minister's Employment Generation Programme",
    shortName: "PMEGP",
    slug: "pmegp",
    summary: "Credit-linked subsidy programme to generate self-employment opportunities through micro-enterprises in non-farm sectors.",
    description: "PMEGP is a major credit-linked subsidy scheme administered by the Ministry of MSME through KVIC. The scheme provides financial assistance to establish micro-enterprises in manufacturing and service sectors, with higher subsidy rates for rural and special category entrepreneurs.",
    governmentLevel: "central",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    department: "Khadi and Village Industries Commission (KVIC)",
    implementingAgency: "KVIC, KVIB, and District Industries Centres (DIC)",
    schemeStatus: "active",
    fundingRange: { min: 50000, max: 5000000 },
    subsidyPercentage: 35,
    benefitsSummary: [
      "Up to 35% margin money subsidy in rural areas for special category beneficiaries (SC/ST/Women/Minority/OBC).",
      "Up to 25% subsidy for general category beneficiaries in rural areas.",
      "Maximum project cost up to ₹50 Lakh for manufacturing units and ₹20 Lakh for service units.",
      "Bank finance of 90-95% of project cost with repayment tenure of 3 to 7 years."
    ],
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 70,
      genderAllowed: ["all"],
      socialCategoriesAllowed: ["all"],
      allowedBusinessStages: ["idea", "starting"],
      allowedEnterpriseTypes: ["micro"],
      maxTurnover: 10000000,
      maxFundingSupported: 5000000,
      statesApplicable: ["all"],
      areaTypeAllowed: ["all"]
    },
    documentsRequired: [
      "Aadhaar Card and PAN Card",
      "Detailed Project Report (DPR)",
      "Educational qualification certificate (minimum 8th pass for manufacturing > ₹10L)",
      "Caste / Category Certificate (if claiming special subsidy)",
      "Rural area certificate issued by local authority (for 35% rural subsidy)",
      "Bank Account details & Passbook copy"
    ],
    applicationProcess: [
      "Register online at the official PMEGP e-Portal (kviconline.gov.in).",
      "Fill personal, enterprise, and financing details in the online application form.",
      "Upload required project report, identity proof, and category certificates.",
      "Submit application to chosen District Industries Centre (DIC) or KVIC/KVIB agency.",
      "Task Force committee reviews and forwards eligible proposals to financing banks for sanction."
    ],
    applicationUrl: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
    officialSourceUrl: "https://msme.gov.in/schemes/pmegp",
    launchDate: "2008-08-15",
    version: 4,
    lastVerifiedAt: "2026-09-01"
  },
  {
    id: "scheme-standup-india",
    schemeName: "Stand-Up India Scheme for Women and SC/ST Entrepreneurs",
    shortName: "Stand-Up India",
    slug: "standup-india",
    summary: "Bank loans between ₹10 Lakh and ₹1 Crore to at least one SC/ST and one Woman borrower per bank branch for greenfield enterprises.",
    description: "The Stand-Up India scheme facilitates bank loans to promote entrepreneurship among women and SC/ST communities for establishing greenfield enterprises in manufacturing, services, agri-allied, or trading sectors.",
    governmentLevel: "central",
    ministry: "Ministry of Finance",
    department: "Department of Financial Services (DFS)",
    implementingAgency: "Scheduled Commercial Banks and SIDBI",
    schemeStatus: "active",
    fundingRange: { min: 1000000, max: 10000000 },
    benefitsSummary: [
      "Composite loan between ₹10 Lakh and ₹100 Lakh covering term loan and working capital.",
      "Margin money requirement reduced to 15% with convergence from eligible state/central subsidies.",
      "Credit guarantee coverage provided through Credit Guarantee Fund for Stand-Up India (CGFSI).",
      "Handholding support through Lead District Managers and SIDBI enterprise centers."
    ],
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 65,
      genderAllowed: ["female"],
      socialCategoriesAllowed: ["sc", "st", "general", "obc", "minority", "ews"],
      allowedBusinessStages: ["idea", "starting"],
      allowedEnterpriseTypes: ["micro", "small"],
      maxFundingSupported: 10000000,
      statesApplicable: ["all"],
      areaTypeAllowed: ["all"]
    },
    documentsRequired: [
      "Identity Proof (Aadhaar / Voter ID / Passport)",
      "Proof of SC/ST or declaration of woman proprietorship (>51% equity)",
      "Greenfield business plan and project cost breakdown",
      "Bank statements for last 6 months",
      "Lease deed / ownership document for enterprise location"
    ],
    applicationProcess: [
      "Access Stand-Up India Portal (standupmitra.in).",
      "Register as a borrower and choose your enterprise sector and loan requirements.",
      "Select preferred bank branch or connect with handholding support agency.",
      "Submit electronic application with verified project reports.",
      "Track application and receive loan sanction from the bank."
    ],
    applicationUrl: "https://www.standupmitra.in",
    officialSourceUrl: "https://www.standupmitra.in",
    launchDate: "2016-04-05",
    version: 3,
    lastVerifiedAt: "2026-09-01"
  },
  {
    id: "scheme-cgtmse",
    schemeName: "Credit Guarantee Fund Trust for Micro and Small Enterprises",
    shortName: "CGTMSE",
    slug: "cgtmse",
    summary: "Collateral-free credit facility up to ₹5 Crore for micro and small enterprises through scheduled commercial banks and NBFCs.",
    description: "CGTMSE enables entrepreneurs to secure business loans without third-party guarantee or collateral security. The trust provides guarantee cover of 75% to 85% to lending institutions, mitigating credit risk.",
    governmentLevel: "central",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    department: "SIDBI & MSME Ministry",
    implementingAgency: "CGTMSE Trust & Member Lending Institutions (MLIs)",
    schemeStatus: "active",
    fundingRange: { min: 200000, max: 50000000 },
    benefitsSummary: [
      "Collateral-free credit facility up to ₹5 Crore (₹500 Lakh).",
      "Guarantee coverage up to 85% for micro-enterprises and women-owned units.",
      "Concessional annual guarantee fees for women, SC/ST, and ZED-certified MSMEs.",
      "Seamless integration with working capital and term loans from public/private banks."
    ],
    eligibilityCriteria: {
      minAge: 18,
      genderAllowed: ["all"],
      socialCategoriesAllowed: ["all"],
      allowedBusinessStages: ["starting", "existing", "expansion"],
      allowedEnterpriseTypes: ["micro", "small"],
      maxFundingSupported: 50000000,
      statesApplicable: ["all"],
      areaTypeAllowed: ["all"]
    },
    documentsRequired: [
      "Udyam Registration Certificate",
      "ITR filings and financial statements for previous 2 years (for existing units)",
      "Project viability report for new capital expenditure",
      "GST returns and KYC documents of enterprise promoters"
    ],
    applicationProcess: [
      "Prepare your comprehensive business and credit requirement proposal.",
      "Approach any Member Lending Institution (Bank / NBFC / RRB).",
      "Apply for MSME loan under the CGTMSE collateral-free guarantee scheme.",
      "Bank evaluates credit risk and applies to CGTMSE portal for guarantee cover sanction.",
      "Loan is disbursed without asking for real estate or asset collateral."
    ],
    applicationUrl: "https://www.cgtmse.in",
    officialSourceUrl: "https://www.cgtmse.in",
    launchDate: "2000-08-30",
    version: 5,
    lastVerifiedAt: "2026-09-01"
  },
  {
    id: "scheme-mudra-yojana",
    schemeName: "Pradhan Mantri MUDRA Yojana",
    shortName: "PMMY",
    slug: "pmmy-mudra",
    summary: "Affordable business loans up to ₹20 Lakh under Shishu, Kishore, and Tarun categories for non-corporate micro-units.",
    description: "PMMY provides seamless institutional credit to micro-enterprises and small business owners in manufacturing, trading, and services. Under Budget enhancements, the loan ceiling under Tarun Plus has been expanded up to ₹20 Lakh for past repayment performers.",
    governmentLevel: "central",
    ministry: "Ministry of Finance",
    department: "Department of Financial Services (DFS)",
    implementingAgency: "Commercial Banks, RRBs, Small Finance Banks, MFIs",
    schemeStatus: "active",
    fundingRange: { min: 25000, max: 2000000 },
    benefitsSummary: [
      "Shishu: Loans up to ₹50,000 for early-stage and micro ventures.",
      "Kishore: Loans from ₹50,001 to ₹5,00,000 for equipment and raw material purchase.",
      "Tarun / Tarun Plus: Loans from ₹5,00,001 up to ₹20,00,000 for scale-up.",
      "Zero processing fees and collateral-free loan disbursement."
    ],
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 65,
      genderAllowed: ["all"],
      socialCategoriesAllowed: ["all"],
      allowedBusinessStages: ["idea", "starting", "existing", "expansion"],
      allowedEnterpriseTypes: ["micro"],
      maxFundingSupported: 2000000,
      statesApplicable: ["all"],
      areaTypeAllowed: ["all"]
    },
    documentsRequired: [
      "Identity Proof and Address Proof",
      "Quotation / proforma invoice for machinery or items to be purchased",
      "Proof of business registration / license / Udyam registration",
      "Bank statement for last 6 months"
    ],
    applicationProcess: [
      "Apply through the JanSamarth digital credit portal (jansamarth.in).",
      "Select Pradhan Mantri MUDRA Yojana and enter entrepreneur details.",
      "Digital in-principle approval is matched with nearest financing bank.",
      "Complete physical or video verification with bank officer.",
      "Loan is disbursed with MUDRA RuPay Debit Card for working capital draws."
    ],
    applicationUrl: "https://www.jansamarth.in/business-activity-loan-schemes",
    officialSourceUrl: "https://www.mudra.org.in",
    launchDate: "2015-04-08",
    version: 4,
    lastVerifiedAt: "2026-09-01"
  },
  {
    id: "scheme-mp-msme-incentive",
    schemeName: "Madhya Pradesh MSME Industrial Development & Capital Subsidy",
    shortName: "MP MSME Policy",
    slug: "mp-msme-policy",
    summary: "State capital subsidy up to 40%, interest subvention of 5%, and power tariff concession for manufacturing MSMEs established in Madhya Pradesh.",
    description: "The Madhya Pradesh MSME Development Policy offers localized capital investment subsidies, electricity duty exemption, and patent reimbursement to foster regional industrial growth across Bhopal, Indore, Jabalpur, and non-notified industrial sectors.",
    governmentLevel: "state",
    ministry: "Government of Madhya Pradesh",
    department: "Department of Micro, Small and Medium Enterprises (MP)",
    implementingAgency: "District Trade and Industry Centre (DTIC MP)",
    schemeStatus: "active",
    fundingRange: { min: 100000, max: 25000000 },
    subsidyPercentage: 40,
    benefitsSummary: [
      "Investment subsidy up to 40% on plant, machinery, and industrial building cost.",
      "5% interest subsidy for 5 years on term loans from commercial financial institutions.",
      "100% exemption on Electricity Duty for 5 to 7 years from commercial production.",
      "Special 10% additional assistance for women and SC/ST industrial promoters."
    ],
    eligibilityCriteria: {
      minAge: 18,
      genderAllowed: ["all"],
      socialCategoriesAllowed: ["all"],
      allowedBusinessStages: ["starting", "existing", "expansion"],
      allowedEnterpriseTypes: ["micro", "small", "medium"],
      statesApplicable: ["Madhya Pradesh"],
      areaTypeAllowed: ["all"]
    },
    documentsRequired: [
      "Udyam Registration Certificate in MP state",
      "Land purchase / lease deed in recognized MP industrial zone or private plot",
      "Sanctioned term loan letter from financial institution",
      "Chartered Accountant certified capital expenditure certificate",
      "Factory license and Pollution Control Board consent"
    ],
    applicationProcess: [
      "Register on the MP Industry portal (invest.mp.gov.in).",
      "Fill online Common Application Form (CAF) under MSME Policy.",
      "Upload audited expenditure bills, sanction letters, and Udyam certificate.",
      "DTIC officer conducts site inspection of installed machinery.",
      "Subsidy is credited directly into bank term loan account as margin money reduction."
    ],
    applicationUrl: "https://invest.mp.gov.in",
    officialSourceUrl: "https://msme.mponline.gov.in",
    launchDate: "2021-04-01",
    version: 2,
    lastVerifiedAt: "2026-09-01"
  }
];
