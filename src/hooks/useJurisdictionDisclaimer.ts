import { useGeo } from "@/contexts/GeoContext";
import { getJurisdictionLegal, type JurisdictionLegalText } from "@/lib/jurisdictionLegal";

export function useJurisdictionDisclaimer(): JurisdictionLegalText & { countryName: string; regionCode: string } {
  const geo = useGeo();
  const legal = getJurisdictionLegal(geo.regionCode);
  return { ...legal, countryName: geo.jurisdiction.countryName, regionCode: geo.regionCode };
}
