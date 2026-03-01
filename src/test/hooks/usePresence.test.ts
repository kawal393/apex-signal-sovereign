import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePresence } from "@/hooks/usePresence";

describe("usePresence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns presence data with city and time", () => {
    const { result } = renderHook(() => usePresence());
    expect(result.current.city).toBeTruthy();
    expect(["night", "dawn", "day", "dusk"]).toContain(result.current.timeOfDay);
  });

  it("first visit is not returning", () => {
    const { result } = renderHook(() => usePresence());
    expect(result.current.isReturning).toBe(false);
    expect(result.current.visitCount).toBe(1);
  });

  it("second visit is returning", () => {
    localStorage.setItem("apex_presence", JSON.stringify({ visitCount: 1, lastVisit: Date.now() }));
    const { result } = renderHook(() => usePresence());
    expect(result.current.isReturning).toBe(true);
    expect(result.current.visitCount).toBe(2);
  });
});
