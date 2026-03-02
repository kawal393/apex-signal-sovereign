import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type JurisdictionInfo = {
  primary: string[];
  currency: string;
  currencySymbol: string;
  exchangeRate: number; // from AUD
  countryName: string;
};

const JURISDICTION_MAP: Record<string, JurisdictionInfo> = {
  // Asia-Pacific
  AU: { primary: ["NDIS", "AUSTRAC", "Mining"], currency: "AUD", currencySymbol: "A$", exchangeRate: 1, countryName: "Australia" },
  NZ: { primary: ["FMA", "RBNZ", "Commerce Commission"], currency: "NZD", currencySymbol: "NZ$", exchangeRate: 1.08, countryName: "New Zealand" },
  JP: { primary: ["FSA", "APPI", "J-SOX"], currency: "JPY", currencySymbol: "¥", exchangeRate: 97.5, countryName: "Japan" },
  SG: { primary: ["MAS", "PDPA", "SGX"], currency: "SGD", currencySymbol: "S$", exchangeRate: 0.88, countryName: "Singapore" },
  IN: { primary: ["SEBI", "RBI", "DPDP Act"], currency: "INR", currencySymbol: "₹", exchangeRate: 54.2, countryName: "India" },
  KR: { primary: ["FSC", "PIPA", "K-IFRS"], currency: "KRW", currencySymbol: "₩", exchangeRate: 866, countryName: "South Korea" },
  HK: { primary: ["SFC", "HKMA", "PDPO"], currency: "HKD", currencySymbol: "HK$", exchangeRate: 5.08, countryName: "Hong Kong" },
  TW: { primary: ["FSC", "PDPA", "TWSE"], currency: "TWD", currencySymbol: "NT$", exchangeRate: 20.5, countryName: "Taiwan" },
  TH: { primary: ["SEC", "BOT", "PDPA"], currency: "THB", currencySymbol: "฿", exchangeRate: 22.8, countryName: "Thailand" },
  VN: { primary: ["SSC", "SBV", "Cybersecurity Law"], currency: "VND", currencySymbol: "₫", exchangeRate: 16200, countryName: "Vietnam" },
  PH: { primary: ["SEC", "BSP", "Data Privacy Act"], currency: "PHP", currencySymbol: "₱", exchangeRate: 36.4, countryName: "Philippines" },
  ID: { primary: ["OJK", "Bank Indonesia", "PDP Law"], currency: "IDR", currencySymbol: "Rp", exchangeRate: 10200, countryName: "Indonesia" },
  MY: { primary: ["SC", "BNM", "PDPA"], currency: "MYR", currencySymbol: "RM", exchangeRate: 2.88, countryName: "Malaysia" },
  BD: { primary: ["BSEC", "Bangladesh Bank", "Digital Security Act"], currency: "BDT", currencySymbol: "৳", exchangeRate: 71.5, countryName: "Bangladesh" },
  PK: { primary: ["SECP", "SBP", "PECA"], currency: "PKR", currencySymbol: "₨", exchangeRate: 181, countryName: "Pakistan" },
  // Americas
  US: { primary: ["SEC", "FDA", "FTC"], currency: "USD", currencySymbol: "$", exchangeRate: 0.65, countryName: "United States" },
  CA: { primary: ["PIPEDA", "CSA", "Provincial Regs"], currency: "CAD", currencySymbol: "C$", exchangeRate: 0.89, countryName: "Canada" },
  BR: { primary: ["CVM", "LGPD", "BACEN"], currency: "BRL", currencySymbol: "R$", exchangeRate: 3.16, countryName: "Brazil" },
  MX: { primary: ["CNBV", "LFPDPPP", "COFECE"], currency: "MXN", currencySymbol: "MX$", exchangeRate: 11.1, countryName: "Mexico" },
  CL: { primary: ["CMF", "Data Protection Bill", "SVS"], currency: "CLP", currencySymbol: "CL$", exchangeRate: 572, countryName: "Chile" },
  CO: { primary: ["SFC", "SIC", "Habeas Data Law"], currency: "COP", currencySymbol: "COL$", exchangeRate: 2560, countryName: "Colombia" },
  AR: { primary: ["CNV", "AAIP", "Data Protection Law"], currency: "ARS", currencySymbol: "AR$", exchangeRate: 570, countryName: "Argentina" },
  PE: { primary: ["SMV", "SBS", "Data Protection Law"], currency: "PEN", currencySymbol: "S/", exchangeRate: 2.42, countryName: "Peru" },
  // Europe
  GB: { primary: ["FCA", "ICO", "Companies House"], currency: "GBP", currencySymbol: "£", exchangeRate: 0.52, countryName: "United Kingdom" },
  UK: { primary: ["FCA", "ICO", "Companies House"], currency: "GBP", currencySymbol: "£", exchangeRate: 0.52, countryName: "United Kingdom" },
  DE: { primary: ["EU AI Act", "GDPR", "BaFin"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "Germany" },
  FR: { primary: ["EU AI Act", "GDPR", "AMF"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "France" },
  NL: { primary: ["EU AI Act", "GDPR", "AFM"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "Netherlands" },
  IT: { primary: ["EU AI Act", "GDPR", "CONSOB"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "Italy" },
  ES: { primary: ["EU AI Act", "GDPR", "CNMV"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "Spain" },
  CH: { primary: ["FINMA", "FADP", "SIX"], currency: "CHF", currencySymbol: "CHF", exchangeRate: 0.57, countryName: "Switzerland" },
  SE: { primary: ["EU AI Act", "GDPR", "FI"], currency: "SEK", currencySymbol: "kr", exchangeRate: 6.82, countryName: "Sweden" },
  NO: { primary: ["Finanstilsynet", "GDPR", "Oslo Børs"], currency: "NOK", currencySymbol: "kr", exchangeRate: 6.88, countryName: "Norway" },
  DK: { primary: ["EU AI Act", "GDPR", "Finanstilsynet"], currency: "DKK", currencySymbol: "kr", exchangeRate: 4.52, countryName: "Denmark" },
  FI: { primary: ["EU AI Act", "GDPR", "FIN-FSA"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "Finland" },
  PL: { primary: ["EU AI Act", "GDPR", "KNF"], currency: "PLN", currencySymbol: "zł", exchangeRate: 2.58, countryName: "Poland" },
  CZ: { primary: ["EU AI Act", "GDPR", "CNB"], currency: "CZK", currencySymbol: "Kč", exchangeRate: 14.8, countryName: "Czech Republic" },
  AT: { primary: ["EU AI Act", "GDPR", "FMA"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "Austria" },
  BE: { primary: ["EU AI Act", "GDPR", "FSMA"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "Belgium" },
  PT: { primary: ["EU AI Act", "GDPR", "CMVM"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "Portugal" },
  IE: { primary: ["EU AI Act", "GDPR", "CBI"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "Ireland" },
  // Middle East & Africa
  AE: { primary: ["DFSA", "ADGM", "VARA"], currency: "AED", currencySymbol: "د.إ", exchangeRate: 2.39, countryName: "UAE" },
  SA: { primary: ["CMA", "SAMA", "PDPL"], currency: "SAR", currencySymbol: "﷼", exchangeRate: 2.44, countryName: "Saudi Arabia" },
  IL: { primary: ["ISA", "PPA", "BOI"], currency: "ILS", currencySymbol: "₪", exchangeRate: 2.36, countryName: "Israel" },
  TR: { primary: ["CMB", "KVKK", "BRSA"], currency: "TRY", currencySymbol: "₺", exchangeRate: 22.1, countryName: "Turkey" },
  ZA: { primary: ["FSCA", "POPIA", "JSE"], currency: "ZAR", currencySymbol: "R", exchangeRate: 11.8, countryName: "South Africa" },
  NG: { primary: ["SEC", "NDPR", "CBN"], currency: "NGN", currencySymbol: "₦", exchangeRate: 1010, countryName: "Nigeria" },
  EG: { primary: ["FRA", "CBE", "Data Protection Law"], currency: "EGP", currencySymbol: "E£", exchangeRate: 31.8, countryName: "Egypt" },
  KE: { primary: ["CMA", "CBK", "Data Protection Act"], currency: "KES", currencySymbol: "KSh", exchangeRate: 99.2, countryName: "Kenya" },
};

// Map country codes to region codes for regulatory_updates table
const COUNTRY_TO_REGION: Record<string, string> = {
  AU: "AU", NZ: "AU",
  US: "US", CA: "CA",
  BR: "LATAM", MX: "LATAM", CL: "LATAM", CO: "LATAM", AR: "LATAM", PE: "LATAM",
  GB: "UK", UK: "UK",
  DE: "EU", FR: "EU", NL: "EU", IT: "EU", ES: "EU", SE: "EU", DK: "EU", FI: "EU", PL: "EU", CZ: "EU", AT: "EU", BE: "EU", PT: "EU", IE: "EU",
  CH: "CH", NO: "NO",
  JP: "JP", SG: "SG", IN: "IN", KR: "KR", HK: "HK", TW: "TW",
  TH: "ASEAN", VN: "ASEAN", PH: "ASEAN", ID: "ASEAN", MY: "ASEAN",
  BD: "SA", PK: "SA",
  AE: "AE", SA: "MENA", IL: "MENA", TR: "MENA", EG: "MENA",
  ZA: "AF", NG: "AF", KE: "AF",
};

export type GeoData = {
  country: string;
  countryCode: string;
  city: string;
  currency: string;
  timezone: string;
  jurisdiction: JurisdictionInfo;
  regionCode: string;
  loading: boolean;
};

const defaultGeo: GeoData = {
  country: "Australia",
  countryCode: "AU",
  city: "Sydney",
  currency: "AUD",
  timezone: "Australia/Sydney",
  jurisdiction: JURISDICTION_MAP.AU,
  regionCode: "AU",
  loading: true,
};

const GeoContext = createContext<GeoData>(defaultGeo);

export const useGeo = () => useContext(GeoContext);

export const GeoProvider = ({ children }: { children: ReactNode }) => {
  const [geo, setGeo] = useState<GeoData>(defaultGeo);

  useEffect(() => {
    const cached = localStorage.getItem("apex_geo");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const code = parsed.countryCode || "AU";
        const jurisdiction = JURISDICTION_MAP[code] || JURISDICTION_MAP.AU;
        const regionCode = COUNTRY_TO_REGION[code] || "AU";
        setGeo({ ...parsed, jurisdiction, regionCode, loading: false });
        return;
      } catch {}
    }

    const detect = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("geo-detect");
        if (error) throw error;
        const code = data.countryCode || "AU";
        const jurisdiction = JURISDICTION_MAP[code] || JURISDICTION_MAP.AU;
        const regionCode = COUNTRY_TO_REGION[code] || "AU";
        const geoData = { ...data, jurisdiction, regionCode, loading: false };
        setGeo(geoData);
        localStorage.setItem("apex_geo", JSON.stringify(data));
      } catch {
        setGeo({ ...defaultGeo, loading: false });
      }
    };
    detect();
  }, []);

  return <GeoContext.Provider value={geo}>{children}</GeoContext.Provider>;
};

export const convertPrice = (audPrice: number, geo: GeoData): string => {
  const converted = Math.round(audPrice * geo.jurisdiction.exchangeRate);
  return `${geo.jurisdiction.currencySymbol}${converted.toLocaleString()}`;
};
