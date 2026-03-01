import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRotatingStatement } from "@/hooks/useRotatingStatement";

describe("useRotatingStatement", () => {
  it("returns a statement with primary text", () => {
    const { result } = renderHook(() => useRotatingStatement());
    expect(result.current.primary).toBeTruthy();
    expect(typeof result.current.primary).toBe("string");
  });

  it("secondary is string or null", () => {
    const { result } = renderHook(() => useRotatingStatement());
    expect(result.current.secondary === null || typeof result.current.secondary === "string").toBe(true);
  });
});
