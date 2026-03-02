// Jurisdiction-specific legal language templates

export type LegalRegion = "AU" | "EU" | "UK" | "US" | "MENA" | "ASEAN" | "LATAM" | "DEFAULT";

function getRegionGroup(regionCode: string): LegalRegion {
  if (regionCode === "AU") return "AU";
  if (["EU", "CH", "NO"].includes(regionCode)) return "EU";
  if (regionCode === "UK") return "UK";
  if (regionCode === "US" || regionCode === "CA") return "US";
  if (["AE", "MENA", "SA"].includes(regionCode)) return "MENA";
  if (["ASEAN", "SG", "JP", "KR", "HK", "TW", "IN"].includes(regionCode)) return "ASEAN";
  if (regionCode === "LATAM") return "LATAM";
  return "DEFAULT";
}

export type JurisdictionLegalText = {
  disclaimerAddendum: string;
  privacyAddendum: string;
  termsGoverningLaw: string;
  consentType: "gdpr" | "ccpa" | "standard";
  consentText: string;
};

const legalTemplates: Record<LegalRegion, JurisdictionLegalText> = {
  AU: {
    disclaimerAddendum: "",
    privacyAddendum: "",
    termsGoverningLaw: "These terms are governed exclusively by the laws of Australia. Any disputes shall be resolved in Australian courts of competent jurisdiction.",
    consentType: "standard",
    consentText: "This site uses cookies and analytics to improve your experience. By continuing to use this site, you consent to our use of cookies.",
  },
  EU: {
    disclaimerAddendum: "AI Disclosure (EU AI Act): APEX utilises artificial intelligence systems for analysis and assessment generation. These systems are classified as limited-risk under the EU AI Act. All AI-generated content is clearly identified. You have the right to request human review of any AI-generated assessment.",
    privacyAddendum: "GDPR Rights: Under the General Data Protection Regulation, you have the right to access, rectify, erase, restrict processing, data portability, and object to processing of your personal data. To exercise these rights, submit a request through our access gate. Data processing legal basis: legitimate interest (Art. 6(1)(f) GDPR) for service provision, and consent (Art. 6(1)(a) GDPR) for analytics. Data transfers outside the EEA are protected by Standard Contractual Clauses.",
    termsGoverningLaw: "These terms are governed by the laws of Australia. For EU/EEA residents, nothing in these terms affects your mandatory consumer protection rights under EU law. Disputes shall first be submitted to mediation. If unresolved, disputes shall be referred to binding arbitration under the rules of the Australian Centre for International Commercial Arbitration (ACICA).",
    consentType: "gdpr",
    consentText: "We use essential cookies for site functionality. Analytics and tracking cookies require your explicit consent under GDPR. You may withdraw consent at any time.",
  },
  UK: {
    disclaimerAddendum: "FCA Compliance Notice: APEX Infrastructure is not authorised or regulated by the Financial Conduct Authority. Our services do not constitute regulated financial advice. If you require regulated advice, consult an FCA-authorised firm.",
    privacyAddendum: "UK GDPR Rights: Under the UK General Data Protection Regulation and Data Protection Act 2018, you have rights to access, rectification, erasure, restriction, portability, and objection. Contact our Data Protection contact through the access gate. International data transfers are protected by International Data Transfer Agreements.",
    termsGoverningLaw: "These terms are governed by Australian law. For UK residents, your statutory consumer rights remain unaffected. Disputes shall be resolved through binding arbitration under ACICA rules, with the seat of arbitration in Sydney, Australia.",
    consentType: "gdpr",
    consentText: "We use essential cookies for site functionality. Analytics cookies require your explicit consent under UK GDPR. You may change your preferences at any time.",
  },
  US: {
    disclaimerAddendum: "US Regulatory Notice: APEX is not a registered investment adviser, broker-dealer, or law firm under US federal or state law. Our assessments do not constitute securities advice, legal counsel, or professional recommendations requiring licensure in any US jurisdiction.",
    privacyAddendum: "California Privacy Rights (CCPA/CPRA): If you are a California resident, you have the right to know what personal information we collect, request deletion, opt out of the sale or sharing of personal information, and non-discrimination for exercising your rights. We do not sell your personal information. To exercise your rights, submit a request through our access gate. Categories of PI collected: identifiers, internet activity, professional information.",
    termsGoverningLaw: "These terms are governed by Australian law. For US users, disputes shall be resolved through binding arbitration under the rules of the Australian Centre for International Commercial Arbitration (ACICA), with the seat in Sydney, Australia. You waive any right to participate in class action proceedings.",
    consentType: "ccpa",
    consentText: "We use cookies for site functionality and analytics. California residents: we do not sell your personal information. You may opt out of non-essential tracking.",
  },
  MENA: {
    disclaimerAddendum: "Regional Notice: APEX services are provided from Australia and are not licensed by any financial or regulatory authority in the Middle East or North Africa. Local regulatory requirements may apply to the use of our assessments in your jurisdiction.",
    privacyAddendum: "Data Protection: Your personal data is processed in Australia. For UAE residents under DIFC/ADGM data protection laws, or Saudi residents under PDPL, you may request access to or deletion of your data through our access gate.",
    termsGoverningLaw: "These terms are governed by Australian law. Disputes with users in the MENA region shall be resolved through binding arbitration under ACICA rules in Sydney, Australia. This clause is governed by the New York Convention on the Recognition and Enforcement of Foreign Arbitral Awards.",
    consentType: "standard",
    consentText: "This site uses cookies and analytics. By continuing to use this site, you consent to our data practices as described in our Privacy Policy.",
  },
  ASEAN: {
    disclaimerAddendum: "APAC Notice: APEX services originate from Australia and are not registered with any securities, financial, or data protection authority in your jurisdiction. Users should verify compliance with local regulations before relying on assessments.",
    privacyAddendum: "Data Protection: Your data is processed and stored in Australia. Users in jurisdictions with data protection laws (Singapore PDPA, Japan APPI, South Korea PIPA, India DPDP Act, etc.) may exercise access and deletion rights through our access gate.",
    termsGoverningLaw: "These terms are governed by Australian law. Disputes shall be resolved through binding arbitration under ACICA rules in Sydney. This agreement is subject to the New York Convention.",
    consentType: "standard",
    consentText: "This site uses cookies and analytics to improve your experience. By continuing, you consent to our use of cookies as described in our Privacy Policy.",
  },
  LATAM: {
    disclaimerAddendum: "Aviso Regional: Los servicios de APEX se proporcionan desde Australia. APEX no está registrado ante ninguna autoridad regulatoria en América Latina. Regional Notice: APEX services are provided from Australia and are not registered with any regulatory authority in Latin America.",
    privacyAddendum: "Data Protection: For Brazilian users under LGPD, you have rights to access, correction, deletion, and portability of your personal data. For users in other LATAM jurisdictions, equivalent rights may apply under local law. Contact us through the access gate.",
    termsGoverningLaw: "These terms are governed by Australian law. Disputes with Latin American users shall be resolved through binding arbitration under ACICA rules in Sydney, Australia, subject to the New York Convention.",
    consentType: "standard",
    consentText: "This site uses cookies and analytics. By continuing to use this site, you consent to our use of cookies. Brazilian users: see our LGPD disclosures in the Privacy Policy.",
  },
  DEFAULT: {
    disclaimerAddendum: "International Notice: APEX Infrastructure operates from Australia. Services are not licensed or registered in your jurisdiction. Local regulatory requirements may apply.",
    privacyAddendum: "International Users: Your data is processed in Australia under Australian privacy law. You may request access to or deletion of your data through our access gate.",
    termsGoverningLaw: "These terms are governed by the laws of Australia. Any disputes arising from or related to these terms shall be resolved through binding arbitration under the rules of the Australian Centre for International Commercial Arbitration (ACICA), with the seat of arbitration in Sydney, Australia.",
    consentType: "standard",
    consentText: "This site uses cookies and analytics. By continuing, you consent to our data practices as described in our Privacy Policy.",
  },
};

export function getJurisdictionLegal(regionCode: string): JurisdictionLegalText {
  const group = getRegionGroup(regionCode);
  return legalTemplates[group];
}
