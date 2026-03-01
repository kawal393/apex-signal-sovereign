import { describe, it, expect } from "vitest";
import { convertPrice } from "@/contexts/GeoContext";
import type { GeoData } from "@/contexts/GeoContext";

const makeGeo = (overrides: Partial<GeoData> = {}): GeoData => ({
  country: "Australia",
  countryCode: "AU",
  city: "Sydney",
  currency: "AUD",
  timezone: "Australia/Sydney",
  jurisdiction: { primary: ["NDIS", "AUSTRAC", "Mining"], currency: "AUD", currencySymbol: "A$", exchangeRate: 1, countryName: "Australia" },
  regionCode: "AU",
  loading: false,
  ...overrides,
});

describe("convertPrice", () => {
  it("converts AUD to AUD (1:1)", () => {
    const geo = makeGeo();
    expect(convertPrice(100, geo)).toBe("A$100");
  });

  it("converts AUD to USD", () => {
    const geo = makeGeo({
      jurisdiction: { primary: ["SEC"], currency: "USD", currencySymbol: "$", exchangeRate: 0.65, countryName: "United States" },
    });
    expect(convertPrice(100, geo)).toBe("$65");
  });

  it("converts AUD to JPY", () => {
    const geo = makeGeo({
      jurisdiction: { primary: ["FSA"], currency: "JPY", currencySymbol: "¥", exchangeRate: 97.5, countryName: "Japan" },
    });
    expect(convertPrice(100, geo)).toBe("¥9,750");
  });

  it("handles zero price", () => {
    const geo = makeGeo();
    expect(convertPrice(0, geo)).toBe("A$0");
  });
});
