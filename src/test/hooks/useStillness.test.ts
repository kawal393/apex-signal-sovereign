import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStillness } from "@/hooks/useStillness";

describe("useStillness", () => {
  it("starts not still", () => {
    const { result } = renderHook(() => useStillness());
    expect(result.current.isStill).toBe(false);
    expect(result.current.hasBeenStill).toBe(false);
    expect(result.current.stillnessProgress).toBe(0);
  });

  it("reset resets all values", () => {
    const { result } = renderHook(() => useStillness());
    act(() => {
      result.current.reset();
    });
    expect(result.current.isStill).toBe(false);
    expect(result.current.hasBeenStill).toBe(false);
    expect(result.current.stillnessProgress).toBe(0);
  });
});
