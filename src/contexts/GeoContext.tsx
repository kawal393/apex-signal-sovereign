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
  AU: { primary: ["NDIS", "AUSTRAC", "Mining"], currency: "AUD", currencySymbol: "A$", exchangeRate: 1, countryName: "Australia" },
  US: { primary: ["SEC", "FDA", "FTC"], currency: "USD", currencySymbol: "$", exchangeRate: 0.65, countryName: "United States" },
  GB: { primary: ["FCA", "ICO", "Companies House"], currency: "GBP", currencySymbol: "£", exchangeRate: 0.52, countryName: "United Kingdom" },
  UK: { primary: ["FCA", "ICO", "Companies House"], currency: "GBP", currencySymbol: "£", exchangeRate: 0.52, countryName: "United Kingdom" },
  DE: { primary: ["EU AI Act", "GDPR", "MiFID II"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "Germany" },
  FR: { primary: ["EU AI Act", "GDPR", "MiFID II"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "France" },
  NL: { primary: ["EU AI Act", "GDPR", "MiFID II"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "Netherlands" },
  IT: { primary: ["EU AI Act", "GDPR", "MiFID II"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "Italy" },
  ES: { primary: ["EU AI Act", "GDPR", "MiFID II"], currency: "EUR", currencySymbol: "€", exchangeRate: 0.61, countryName: "Spain" },
  CA: { primary: ["PIPEDA", "CSA", "Provincial Regs"], currency: "CAD", currencySymbol: "C$", exchangeRate: 0.89, countryName: "Canada" },
  JP: { primary: ["FSA", "APPI", "J-SOX"], currency: "JPY", currencySymbol: "¥", exchangeRate: 97.5, countryName: "Japan" },
  SG: { primary: ["MAS", "PDPA", "SGX"], currency: "SGD", currencySymbol: "S$", exchangeRate: 0.88, countryName: "Singapore" },
  IN: { primary: ["SEBI", "RBI", "DPDP Act"], currency: "INR", currencySymbol: "₹", exchangeRate: 54.2, countryName: "India" },
  AE: { primary: ["DFSA", "ADGM", "VARA"], currency: "AED", currencySymbol: "د.إ", exchangeRate: 2.39, countryName: "UAE" },
  KR: { primary: ["FSC", "PIPA", "K-IFRS"], currency: "KRW", currencySymbol: "₩", exchangeRate: 866, countryName: "South Korea" },
};

// Map country codes to region codes for regulatory_updates table
const COUNTRY_TO_REGION: Record<string, string> = {
  AU: "AU", US: "US", GB: "UK", UK: "UK",
  DE: "EU", FR: "EU", NL: "EU", IT: "EU", ES: "EU",
  CA: "CA", JP: "JP", SG: "SG", IN: "IN", AE: "AE", KR: "KR",
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
